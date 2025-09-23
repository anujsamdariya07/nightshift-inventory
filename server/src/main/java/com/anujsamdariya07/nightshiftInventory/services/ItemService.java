package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.dto.ItemRequest;
import com.anujsamdariya07.nightshiftInventory.entity.*;
import com.anujsamdariya07.nightshiftInventory.repository.ItemRepository;
import com.anujsamdariya07.nightshiftInventory.repository.VendorRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private VendorRepository vendorRepository;

    public List<Item> getItemsByOrgId(ObjectId orgId) {
        return itemRepository.findAllByOrgId(orgId);
    }

    public Item getItemById(ObjectId id) {
        return itemRepository.findById(id).orElse(null);
    }

    public boolean existsByNameAndOrgId(String name, ObjectId orgId) {
        return itemRepository.existsByNameAndOrgId(name, orgId);
    }

    public boolean existsByName(String name) {
        return itemRepository.existsByName(name);
    }

    private String generateItemId(ObjectId orgId) {
        List<Item> items = itemRepository.findAllByOrgId(orgId);

        int maxId = items.stream()
                .map(Item::getItemId)
                .filter(id -> id != null && id.startsWith("ITEM-"))
                .map(id -> id.substring(5))
                .filter(num -> num.matches("\\d+"))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);
        System.out.println(maxId);

        int nextId = maxId + 1;

        return String.format("ITEM-%03d", nextId);
    }

    public Item createItem(ItemRequest itemRequest) {
        Item item = Item.builder()
                .orgId(itemRequest.getOrgId())
                .name(itemRequest.getName())
                .quantity(itemRequest.getQuantity())
                .threshold(itemRequest.getThreshold())
                .image(itemRequest.getImage() == null ?
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo6ZeL1Ntu-zwEcgRli39ynixVj9yeQtfjAw&s" :
                        itemRequest.getImage())
                .lastDateOfUpdate(new Date())
                .build();
        UpdateHistory updateHistory = UpdateHistory.builder()
                .vendorName(itemRequest.getVendorName())
                .vendorId(itemRequest.getVendorId())
                .quantityUpdated(itemRequest.getQuantity())
                .cost(itemRequest.getCost())
                .date(new Date())
                .updateType(UpdateHistory.UpdateTypes.REPLENISHMENT)
                .build();
        if (item.getUpdateHistory() == null) {
            item.setUpdateHistory(new ArrayList<>());
        }
        item.getUpdateHistory().add(updateHistory);
        item.setItemId(generateItemId(itemRequest.getOrgId()));

        Optional<Vendor> vendor = vendorRepository.findVendorByOrgIdAndVendorId(itemRequest.getOrgId(), itemRequest.getVendorId());

        RestockItem restockItem = RestockItem.builder()
                .itemName(itemRequest.getName())
                .cost(itemRequest.getCost())
                .itemId(item.getItemId())
                .quantity(itemRequest.getQuantity())
                .build();

        vendor.ifPresent(value -> {
            if (value.getReplenishmentHistory() == null) {
                value.setReplenishmentHistory(new ArrayList<>());
            }
            value.getReplenishmentHistory().add(restockItem);
        });
        vendorRepository.save(vendor.get());

        return itemRepository.save(item);
    }

    public Item updateItem(ObjectId id, ItemRequest itemRequest) {
        Item existingItem = itemRepository.findById(id).orElse(null);
        if (existingItem == null) {
            return null;
        }

        existingItem.setName(itemRequest.getName());
        existingItem.setQuantity(existingItem.getQuantity() + itemRequest.getQuantity());
        existingItem.setThreshold(itemRequest.getThreshold());
        if (itemRequest.getImage() != null && !itemRequest.getImage().equals(existingItem.getImage())) {
            existingItem.setImage(itemRequest.getImage());
        }
        existingItem.setLastDateOfUpdate(new Date());

        UpdateHistory updateHistory = UpdateHistory.builder()
                .vendorName(itemRequest.getVendorName())
                .vendorId(itemRequest.getVendorId())
                .orderName(null)
                .orderId(null)
                .quantityUpdated(itemRequest.getQuantity())
                .cost(itemRequest.getCost())
                .date(new Date())
                .updateType(UpdateHistory.UpdateTypes.REPLENISHMENT)
                .build();

        if (existingItem.getUpdateHistory() == null) {
            existingItem.setUpdateHistory(new ArrayList<>());
        }
        existingItem.getUpdateHistory().add(updateHistory);

        Optional<Vendor> vendor = vendorRepository.findVendorByOrgIdAndVendorId(itemRequest.getOrgId(), itemRequest.getVendorId());

        RestockItem restockItem = RestockItem.builder()
                .quantity(itemRequest.getQuantity())
                .itemId(existingItem.getItemId())
                .itemName(existingItem.getName())
                .cost(itemRequest.getCost())
                .build();

        vendor.ifPresent(value -> {
            if (value.getReplenishmentHistory() == null) {
                value.setReplenishmentHistory(new ArrayList<>());
            }
            value.getReplenishmentHistory().add(restockItem);
        });

        vendorRepository.save(vendor.get());

        return itemRepository.save(existingItem);
    }

    public void deleteItem(ObjectId id) {
        itemRepository.deleteById(id);
    }

    public void deductByOrder(ArrayList<OrderItem> items, ObjectId orgId) {
        for (OrderItem item : items) {
            Item extractedItem = itemRepository.findByOrgIdAndName(orgId, item.getItemName());

            System.out.println("extractedItem.getName()" + extractedItem.getName());

            int deducted = Math.min(item.getQuantity(), extractedItem.getQuantity());
            int remainingQuantity = extractedItem.getQuantity() - deducted;

            UpdateHistory updateHistory = UpdateHistory.builder()
                    .vendorName("Order")
                    .quantityUpdated(deducted)
                    .updateType(UpdateHistory.UpdateTypes.ORDER)
                    .date(new Date())
                    .build();

            if (extractedItem.getUpdateHistory() == null) {
                extractedItem.setUpdateHistory(new ArrayList<>());
            }
            extractedItem.getUpdateHistory().add(updateHistory);

            extractedItem.setQuantity(Math.max(remainingQuantity, 0));

            itemRepository.save(extractedItem);
        }
    }

    public void revertByOrder(ArrayList<OrderItem> items, ObjectId orgId) {
        System.out.println("Revert by order!");
        System.out.println(items != null);
        for (OrderItem item : items) {
            Item extractedItem = itemRepository.findByOrgIdAndName(orgId, item.getItemName());
            System.out.println("extractedItem.getName(): " + extractedItem.getName());

            int reverted = item.getQuantity();
            extractedItem.setQuantity(extractedItem.getQuantity() + reverted);

            UpdateHistory updateHistory = UpdateHistory.builder()
                    .vendorName("Order Revert")
                    .quantityUpdated(reverted)
                    .updateType(UpdateHistory.UpdateTypes.ORDERREVERT)
                    .date(new Date())
                    .build();

            if (extractedItem.getUpdateHistory() == null) {
                extractedItem.setUpdateHistory(new ArrayList<>());
            }
            extractedItem.getUpdateHistory().add(updateHistory);


            itemRepository.save(extractedItem);
        }
    }

    public UpdateHistory updateItemQuantityByVendor(ObjectId itemId, UpdateHistory updateQuantityData) {
        Item item = itemRepository.findById(itemId).get();
        item.setQuantity(item.getQuantity() + updateQuantityData.getQuantityUpdated());
        UpdateHistory updateHistory = UpdateHistory.builder()
                .orderName(null)
                .orderId(null)
                .vendorName(updateQuantityData.getVendorName())
                .vendorId(updateQuantityData.getVendorId())
                .quantityUpdated(updateQuantityData.getQuantityUpdated())
                .cost(updateQuantityData.getCost())
                .updateType(UpdateHistory.UpdateTypes.REPLENISHMENT)
                .date(new Date())
                .build();
        if (item.getUpdateHistory() == null) item.setUpdateHistory(new ArrayList<>());
        item.getUpdateHistory().add(updateHistory);

        RestockItem restockItem = RestockItem.builder()
                .cost(updateQuantityData.getCost())
                .quantity(updateQuantityData.getQuantityUpdated())
                .itemName(item.getName())
                .itemId(item.getItemId())
                .build();

        Optional<Vendor> vendor = vendorRepository.findVendorByOrgIdAndVendorId(item.getOrgId(), updateQuantityData.getVendorId());
        vendor.ifPresent(value -> {
            if (value.getReplenishmentHistory() == null) {
                value.setReplenishmentHistory(new ArrayList<>());
            }
            value.setTotalRestocks(value.getTotalRestocks()+1);
            value.setTotalValue(value.getTotalValue() + updateQuantityData.getCost());
            value.getReplenishmentHistory().add(restockItem);
        });
        vendorRepository.save(vendor.get());

        itemRepository.save(item);
        return updateHistory;
    }
}

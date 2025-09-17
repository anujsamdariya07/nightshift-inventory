package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.dto.ItemRequest;
import com.anujsamdariya07.nightshiftInventory.entity.Item;
import com.anujsamdariya07.nightshiftInventory.entity.OrderItem;
import com.anujsamdariya07.nightshiftInventory.entity.UpdateHistory;
import com.anujsamdariya07.nightshiftInventory.repository.ItemRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;

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
                .quantityUpdated(itemRequest.getQuantity())
                .cost(itemRequest.getCost())
                .date(new Date())
                .updateType("replenishment")
                .build();
        if (item.getUpdateHistory() == null) {
            item.setUpdateHistory(new ArrayList<>());
        }
        item.getUpdateHistory().add(updateHistory);

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
                .quantityUpdated(itemRequest.getQuantity())
                .cost(itemRequest.getCost())
                .date(new Date())
                .updateType("replenishment")
                .build();

        if (existingItem.getUpdateHistory() == null) {
            existingItem.setUpdateHistory(new ArrayList<>());
        }
        existingItem.getUpdateHistory().add(updateHistory);

        return itemRepository.save(existingItem);
    }

    public void deleteItem(ObjectId id) {
        itemRepository.deleteById(id);
    }

    public void deductByOrder(ArrayList<OrderItem> items, ObjectId orgId) {
        for (OrderItem item : items) {
            Item extractedItem = itemRepository.findByOrgIdAndName(orgId, item.getItemName());

            int deducted = Math.min(item.getQuantity(), extractedItem.getQuantity());
            int remainingQuantity = extractedItem.getQuantity() - deducted;

            UpdateHistory updateHistory = UpdateHistory.builder()
                    .vendorName("Order")
                    .quantityUpdated(deducted)
                    .updateType("order")
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

    public void revertByOrder(List<OrderItem> items, ObjectId orgId) {
        for (OrderItem item : items) {
            Item extractedItem = itemRepository.findByOrgIdAndName(orgId, item.getItemName());

            int reverted = item.getQuantity();
            extractedItem.setQuantity(extractedItem.getQuantity() + reverted);

            UpdateHistory updateHistory = UpdateHistory.builder()
                    .vendorName("Order Revert")
                    .quantityUpdated(reverted)
                    .updateType("revert")
                    .date(new Date())
                    .build();

            if (extractedItem.getUpdateHistory() == null) {
                extractedItem.setUpdateHistory(new ArrayList<>());
            }
            extractedItem.getUpdateHistory().add(updateHistory);


            itemRepository.save(extractedItem);
        }
    }
}

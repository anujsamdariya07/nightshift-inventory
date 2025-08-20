package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.entity.Item;
import com.anujsamdariya07.nightshiftInventory.entity.Order;
import com.anujsamdariya07.nightshiftInventory.entity.OrderItem;
import com.anujsamdariya07.nightshiftInventory.repository.ItemRepository;
import com.anujsamdariya07.nightshiftInventory.repository.OrderRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ItemService itemService;

    public List<Order> getOrdersByOrgId(ObjectId orgId) {
        return orderRepository.findAllByOrgId(orgId);
    }

    public Order getOrderById(ObjectId id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order createOrder(Order orderRequest) {
        Order order = Order.builder()
                .orgId(orderRequest.getOrgId())
                .customerId(orderRequest.getCustomerId())
                .employeeId(orderRequest.getEmployeeId())
                .items(orderRequest.getItems())
                .totalAmount(orderRequest.getTotalAmount())
                .notes(orderRequest.getNotes())
                .build();

        Order savedOrder = orderRepository.save(order);

        itemService.deductByOrder(savedOrder.getItems(), savedOrder.getOrgId());

        return savedOrder;
    }

    public Order updateOrder(ObjectId id, Order orderRequest) {
        Order existingOrder = getOrderById(id);
        if (existingOrder == null) {
            return null; // order not found
        }

        itemService.revertByOrder(existingOrder.getItems(), existingOrder.getOrgId());

        itemService.deductByOrder(orderRequest.getItems(), existingOrder.getOrgId());

        existingOrder.setCustomerId(orderRequest.getCustomerId());
        existingOrder.setEmployeeId(orderRequest.getEmployeeId());
        existingOrder.setItems(orderRequest.getItems());
        existingOrder.setTotalAmount(orderRequest.getTotalAmount());
        existingOrder.setNotes(orderRequest.getNotes());
        existingOrder.setStatus(orderRequest.getStatus() != null ? orderRequest.getStatus() : existingOrder.getStatus());

        return orderRepository.save(existingOrder);
    }

    public void deleteOrder(ObjectId id) {
        orderRepository.deleteById(id);
    }
}

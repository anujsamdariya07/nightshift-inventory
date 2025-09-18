package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.entity.Order;
import com.anujsamdariya07.nightshiftInventory.entity.Vendor;
import com.anujsamdariya07.nightshiftInventory.repository.OrderRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

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

    private String generateOrderId(ObjectId orgId) {
        List<Order> orders = orderRepository.findAllByOrgId(orgId);

        int maxId = orders.stream()
                .map(Order::getOrderId)
                .filter(id -> id != null && id.startsWith("ORD-"))
                .map(id -> id.substring(4))
                .filter(num -> num.matches("\\d+"))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);
        System.out.println(maxId);

        int nextId = maxId + 1;

        return String.format("ORD-%03d", nextId);
    }

    public Order createOrder(Order orderRequest) {
        Order order = Order.builder()
                .orgId(orderRequest.getOrgId())
                .orderId(generateOrderId(orderRequest.getOrgId()))
                .customerId(orderRequest.getCustomerId())
                .customerName(orderRequest.getCustomerName())
                .employeeId(orderRequest.getEmployeeId())
                .employeeName(orderRequest.getEmployeeName())
                .items(orderRequest.getItems())
                .totalAmount(orderRequest.getTotalAmount())
                .status(Order.OrderStatus.PENDING)
                .orderDate(new Date())
                .deadline(orderRequest.getDeadline())
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
        existingOrder.setCustomerName(orderRequest.getCustomerName());
        existingOrder.setEmployeeId(orderRequest.getEmployeeId());
        existingOrder.setEmployeeName(orderRequest.getEmployeeName());
        existingOrder.setItems(orderRequest.getItems());
        existingOrder.setTotalAmount(orderRequest.getTotalAmount());
        existingOrder.setNotes(orderRequest.getNotes());
        existingOrder.setStatus(orderRequest.getStatus() != null ? orderRequest.getStatus() : existingOrder.getStatus());
        existingOrder.setDeadline(orderRequest.getDeadline());

        return orderRepository.save(existingOrder);
    }

    public void deleteOrder(ObjectId id) {
        Order existingOrder = getOrderById(id);
        if (existingOrder != null) {
            itemService.revertByOrder(existingOrder.getItems(), existingOrder.getOrgId());
            orderRepository.deleteById(id);
        }
    }
}

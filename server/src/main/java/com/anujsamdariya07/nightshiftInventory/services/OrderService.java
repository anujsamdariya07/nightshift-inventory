package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.entity.Order;
import com.anujsamdariya07.nightshiftInventory.entity.Vendor;
import com.anujsamdariya07.nightshiftInventory.repository.OrderRepository;
import jakarta.servlet.http.HttpServletRequest;
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
    @Autowired
    private EmployeeService employeeService;

    public List<Order> getOrdersByOrgId(ObjectId orgId) {
        return orderRepository.findAllByOrgId(orgId);
    }

    public Order getOrderById(ObjectId id) {
        System.out.println("getOrderById");
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) System.out.println("null");
        System.out.println("getOrderById2: " + order.getOrderId());
        return order;
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

    public Order createOrder(HttpServletRequest request, Order orderRequest) {
        // generate orderId
        String generatedOrderId = generateOrderId(orderRequest.getOrgId());

        // set server-generated fields
        orderRequest.setOrderId(generatedOrderId);
        orderRequest.setStatus(Order.OrderStatus.PENDING);
        orderRequest.setOrderDate(new Date());

        // save directly
        Order savedOrder = orderRepository.save(orderRequest);

        // deduct items
        if (savedOrder.getItems() != null && !savedOrder.getItems().isEmpty()) {
            itemService.deductByOrder(savedOrder.getItems(), savedOrder.getOrgId());
        }

        return savedOrder;
    }

    public Order updateOrder(ObjectId id, Order orderRequest) {
        Order existingOrder = getOrderById(id);
        if (existingOrder == null) {
            throw new RuntimeException("Order not found!");
        }

        if (orderRequest.getItems() != null) {
            if (!orderRequest.getItems().isEmpty()) {
                System.out.println(existingOrder.getItems() != null);
                itemService.revertByOrder(existingOrder.getItems(), existingOrder.getOrgId());

                itemService.deductByOrder(orderRequest.getItems(), existingOrder.getOrgId());
            }
        }

        if (orderRequest.getCustomerId() != null && !orderRequest.getCustomerId().equals(existingOrder.getCustomerId())) {
            existingOrder.setCustomerId(orderRequest.getCustomerId());
        }
        if (orderRequest.getCustomerName() != null && !orderRequest.getCustomerName().equals(existingOrder.getCustomerName())) {
            existingOrder.setCustomerName(orderRequest.getCustomerName());
        }
        if (orderRequest.getEmployeeId() != null && !orderRequest.getEmployeeId().equals(existingOrder.getEmployeeId())) {
            existingOrder.setEmployeeId(orderRequest.getEmployeeId());
        }
        if (orderRequest.getEmployeeName() != null && !orderRequest.getEmployeeName().equals(existingOrder.getEmployeeName())) {
            existingOrder.setEmployeeName(orderRequest.getEmployeeName());
        }
        if (orderRequest.getItems() != null && !orderRequest.getItems().equals(existingOrder.getItems())) {
            existingOrder.setItems(orderRequest.getItems());
        }
        if (orderRequest.getTotalAmount() != 0 && orderRequest.getTotalAmount() != existingOrder.getTotalAmount()) {
            existingOrder.setTotalAmount(orderRequest.getTotalAmount());
        }
        if (orderRequest.getNotes() != null && !orderRequest.getNotes().equals(existingOrder.getNotes())) {
            existingOrder.setNotes(orderRequest.getNotes());
        }
        if (orderRequest.getStatus() != null && !orderRequest.getStatus().equals(existingOrder.getStatus())) {
            existingOrder.setStatus(orderRequest.getStatus());
        }
        if (orderRequest.getDeadline() != null && !orderRequest.getDeadline().equals(existingOrder.getDeadline())) {
            existingOrder.setDeadline(orderRequest.getDeadline());
        }

        return orderRepository.save(existingOrder);
    }

    public void deleteOrder(ObjectId id) {
        Order existingOrder = getOrderById(id);
        if (existingOrder != null && existingOrder.getItems() != null && !existingOrder.getItems().isEmpty()) {
            System.out.println(existingOrder.getOrderId());
            itemService.revertByOrder(existingOrder.getItems(), existingOrder.getOrgId());
            orderRepository.deleteById(id);
        } else {
            throw new RuntimeException("Order not found!");
        }
    }
}

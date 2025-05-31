package com.web.gowez.controller;

import com.web.gowez.model.Rental;
import com.web.gowez.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RentalController {
    private final RentalService rentalService;

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<Rental>> getActiveRentalsByUserId(@PathVariable Long userId) {
        List<Rental> rentals = rentalService.getActiveRentalsByUserId(userId);
        return ResponseEntity.ok(rentals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rental> getRentalById(@PathVariable Long id) {
        return rentalService.getRentalByIdWithDetails(id)
                .map(rental -> ResponseEntity.ok(rental))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/user/{userId}")
    public ResponseEntity<Rental> getRentalByIdForUser(@PathVariable Long id, @PathVariable Long userId) {
        return rentalService.getRentalByIdForUser(id, userId)
                .map(rental -> ResponseEntity.ok(rental))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createRental(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long bikeId = Long.valueOf(request.get("bikeId").toString());
            LocalDateTime startDateTime = LocalDateTime.parse(request.get("startDateTime").toString());
            LocalDateTime endDateTime = LocalDateTime.parse(request.get("endDateTime").toString());
            Rental.PaymentMethod paymentMethod = Rental.PaymentMethod.valueOf(
                request.get("paymentMethod").toString().toUpperCase()
            );

            Rental rental = rentalService.createRental(userId, bikeId, startDateTime, endDateTime, paymentMethod);
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRental(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            
            LocalDateTime startDateTime = LocalDateTime.parse(request.get("startDateTime").toString());
            LocalDateTime endDateTime = LocalDateTime.parse(request.get("endDateTime").toString());
            Rental.PaymentMethod paymentMethod = Rental.PaymentMethod.valueOf(
                request.get("paymentMethod").toString().toUpperCase()
            );

            Rental rental = rentalService.updateRentalForUser(id, userId, startDateTime, endDateTime, paymentMethod);
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeRental(@PathVariable Long id) {
        try {
            Rental rental = rentalService.completeRental(id);
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
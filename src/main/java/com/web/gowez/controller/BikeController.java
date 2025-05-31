package com.web.gowez.controller;

import com.web.gowez.model.Bike;
import com.web.gowez.service.BikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bikes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BikeController {
    private final BikeService bikeService;

    @GetMapping
    public ResponseEntity<List<Bike>> getAllBikes() {
        List<Bike> bikes = bikeService.getAllBikes();
        return ResponseEntity.ok(bikes);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Bike>> getAvailableBikes() {
        List<Bike> bikes = bikeService.getAvailableBikes();
        return ResponseEntity.ok(bikes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bike> getBikeById(@PathVariable Long id) {
        return bikeService.getBikeById(id)
                .map(bike -> ResponseEntity.ok(bike))
                .orElse(ResponseEntity.notFound().build());
    }
}
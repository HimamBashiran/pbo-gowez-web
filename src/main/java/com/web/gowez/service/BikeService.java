package com.web.gowez.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.web.gowez.model.Bike;
import com.web.gowez.repository.BikeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BikeService {
    private final BikeRepository bikeRepository;

    public List<Bike> getAllBikes() {
        return bikeRepository.findAll();
    }

    public List<Bike> getAvailableBikes() {
        return bikeRepository.findByStatus(Bike.BikeStatus.AVAILABLE);
    }

    public Optional<Bike> getBikeById(Long id) {
        return bikeRepository.findById(id);
    }

    public Bike saveBike(Bike bike) {
        return bikeRepository.save(bike);
    }

    public void updateBikeStatus(Long bikeId, Bike.BikeStatus status) {
        Optional<Bike> bikeOpt = bikeRepository.findById(bikeId);
        if (bikeOpt.isPresent()) {
            Bike bike = bikeOpt.get();
            bike.setStatus(status);
            bikeRepository.save(bike);
        }
    }
}
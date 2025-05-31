package com.web.gowez.service;

import com.web.gowez.model.Bike;
import com.web.gowez.model.Rental;
import com.web.gowez.model.User;
import com.web.gowez.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class RentalService {
    private final RentalRepository rentalRepository;
    private final BikeService bikeService;
    private final UserService userService;

    public List<Rental> getActiveRentalsByUserId(Long userId) {
        return rentalRepository.findByUserUserIdAndStatusWithBike(userId, Rental.RentalStatus.ACTIVE);
    }

    public Optional<Rental> getRentalById(Long id) {
        return rentalRepository.findById(id);
    }

    public Optional<Rental> getRentalByIdWithDetails(Long id) {
        return rentalRepository.findByIdWithDetails(id);
    }

    public Optional<Rental> getRentalByIdForUser(Long rentalId, Long userId) {
        return rentalRepository.findByIdAndUserUserId(rentalId, userId);
    }

    @Transactional
    public Rental createRental(Long userId, Long bikeId, LocalDateTime startDateTime, LocalDateTime endDateTime, Rental.PaymentMethod paymentMethod) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Bike bike = bikeService.getBikeById(bikeId)
                .orElseThrow(() -> new RuntimeException("Bike not found"));

        if (bike.getStatus() != Bike.BikeStatus.AVAILABLE) {
            throw new RuntimeException("Bike is not available for rental");
        }

        Duration duration = Duration.between(startDateTime, endDateTime);
        int durationHours = (int) Math.ceil(duration.toMinutes() / 60.0);
        BigDecimal totalCost = bike.getHourlyRate().multiply(BigDecimal.valueOf(durationHours));

        Rental rental = Rental.builder()
                .rentalCode(generateRentalCode())
                .user(user)
                .bike(bike)
                .startDateTime(startDateTime)
                .endDateTime(endDateTime)
                .durationHours(durationHours)
                .hourlyRate(bike.getHourlyRate())
                .totalCost(totalCost)
                .paymentMethod(paymentMethod)
                .status(Rental.RentalStatus.ACTIVE)
                .build();

        bikeService.updateBikeStatus(bikeId, Bike.BikeStatus.RENTED);

        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental updateRental(Long rentalId, LocalDateTime startDateTime, 
                              LocalDateTime endDateTime, Rental.PaymentMethod paymentMethod) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (rental.getStatus() != Rental.RentalStatus.ACTIVE) {
            throw new RuntimeException("Cannot update completed rental");
        }

        Duration duration = Duration.between(startDateTime, endDateTime);
        int durationHours = (int) Math.ceil(duration.toMinutes() / 60.0);
        BigDecimal totalCost = rental.getHourlyRate().multiply(BigDecimal.valueOf(durationHours));

        rental.setStartDateTime(startDateTime);
        rental.setEndDateTime(endDateTime);
        rental.setDurationHours(durationHours);
        rental.setTotalCost(totalCost);
        rental.setPaymentMethod(paymentMethod);

        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental updateRentalForUser(Long rentalId, Long userId, LocalDateTime startDateTime, 
                              LocalDateTime endDateTime, Rental.PaymentMethod paymentMethod) {
        Rental rental = rentalRepository.findByIdAndUserUserId(rentalId, userId)
                .orElseThrow(() -> new RuntimeException("Rental not found or not owned by user"));

        if (rental.getStatus() != Rental.RentalStatus.ACTIVE) {
            throw new RuntimeException("Cannot update completed rental");
        }

        Duration duration = Duration.between(startDateTime, endDateTime);
        int durationHours = (int) Math.ceil(duration.toMinutes() / 60.0);
        BigDecimal totalCost = rental.getHourlyRate().multiply(BigDecimal.valueOf(durationHours));

        rental.setStartDateTime(startDateTime);
        rental.setEndDateTime(endDateTime);
        rental.setDurationHours(durationHours);
        rental.setTotalCost(totalCost);
        rental.setPaymentMethod(paymentMethod);

        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental completeRental(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (rental.getStatus() != Rental.RentalStatus.ACTIVE) {
            throw new RuntimeException("Rental is not active");
        }

        rental.setStatus(Rental.RentalStatus.COMPLETED);
        rental.setActualReturnDateTime(LocalDateTime.now());

        bikeService.updateBikeStatus(rental.getBike().getId(), Bike.BikeStatus.AVAILABLE);

        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental completeRentalForUser(Long rentalId, Long userId) {
        Rental rental = rentalRepository.findByIdAndUserUserId(rentalId, userId)
                .orElseThrow(() -> new RuntimeException("Rental not found or not owned by user"));

        if (rental.getStatus() != Rental.RentalStatus.ACTIVE) {
            throw new RuntimeException("Rental is not active");
        }

        rental.setStatus(Rental.RentalStatus.COMPLETED);
        rental.setActualReturnDateTime(LocalDateTime.now());

        bikeService.updateBikeStatus(rental.getBike().getId(), Bike.BikeStatus.AVAILABLE);

        return rentalRepository.save(rental);
    }

    private String generateRentalCode() {
        String code;
        do {
            code = "RNT" + String.format("%05d", new Random().nextInt(100000));
        } while (rentalRepository.existsByRentalCode(code));
        return code;
    }
}
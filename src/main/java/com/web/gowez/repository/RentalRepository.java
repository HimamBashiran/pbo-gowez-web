package com.web.gowez.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.web.gowez.model.Rental;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    @Query("SELECT r FROM Rental r WHERE r.user.userId = :userId AND r.status = :status")
    List<Rental> findByUserUserIdAndStatus(@Param("userId") Long userId, @Param("status") Rental.RentalStatus status);
    
    @Query("SELECT r FROM Rental r LEFT JOIN FETCH r.bike LEFT JOIN FETCH r.user WHERE r.user.userId = :userId AND r.status = :status")
    List<Rental> findByUserUserIdAndStatusWithBike(@Param("userId") Long userId, @Param("status") Rental.RentalStatus status);
    
    @Query("SELECT r FROM Rental r LEFT JOIN FETCH r.bike LEFT JOIN FETCH r.user WHERE r.id = :id")
    Optional<Rental> findByIdWithDetails(@Param("id") Long id);
    
    @Query("SELECT r FROM Rental r LEFT JOIN FETCH r.bike LEFT JOIN FETCH r.user WHERE r.id = :rentalId AND r.user.userId = :userId")
    Optional<Rental> findByIdAndUserUserId(@Param("rentalId") Long rentalId, @Param("userId") Long userId);
    
    boolean existsByRentalCode(String rentalCode);
}
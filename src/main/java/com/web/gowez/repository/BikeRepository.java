package com.web.gowez.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.web.gowez.model.Bike;

@Repository
public interface BikeRepository extends JpaRepository<Bike, Long> {
    List<Bike> findByStatus(Bike.BikeStatus status);
}
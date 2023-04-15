package ies.project.busrush.repository;

import ies.project.busrush.model.Route;
import ies.project.busrush.model.RouteId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, String> {
    @Query("SELECT r FROM Route r WHERE r.id = :routeId")
    Optional<Route> findByRouteId(RouteId routeId);

    @Query("DELETE FROM Route r WHERE r.id = :routeId")
    void deleteByRouteId(RouteId routeId);

}

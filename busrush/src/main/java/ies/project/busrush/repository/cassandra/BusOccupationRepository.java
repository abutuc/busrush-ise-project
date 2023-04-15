package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.BusMetrics;
import ies.project.busrush.model.cassandra.PeopleOnBus;

import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.util.*; 

public interface BusOccupationRepository extends CassandraRepository<PeopleOnBus, String> {

    @Query("SELECT passengers " +
            "FROM bus_metrics " +
            "WHERE bus_id = ?0 " +
            "LIMIT 1")
    List<PeopleOnBus> findPassengersByBusId(String bus_id);
}

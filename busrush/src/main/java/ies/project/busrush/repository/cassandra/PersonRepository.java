package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.Person;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface PersonRepository extends CassandraRepository<Person, String> {
    Person findByName(String name);
}


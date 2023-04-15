package ies.project.busrush.service;

import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.CqlSessionBuilder;
import com.datastax.oss.driver.api.core.cql.BoundStatement;
import com.datastax.oss.driver.api.core.cql.PreparedStatement;

import java.net.InetSocketAddress;

public class CassandraConnector {
    private CqlSession session;

    public void connect(String node, Integer port, String keyspace, String datacenter) {
        // Connect to the Cassandra cluster using the Cassandra Java driver
        CqlSessionBuilder builder = CqlSession.builder(); 
        builder.addContactPoint(new InetSocketAddress(node, port));
        builder.withLocalDatacenter(datacenter);
        session = builder.build(); 

        // Performing a cassandra command protected against SQL injection
        String cql = "USE ? ;";
        PreparedStatement preparedStatement = session.prepare(cql);
        BoundStatement boundStatement = preparedStatement.bind(keyspace);
        session.execute(boundStatement);
        System.out.println("using keyspace busrushdelays"); 

        //createTable();
        //System.out.println("Table Bus Metrics created");

    }

    public CqlSession getSession() {
        return this.session;
    }

    public void close() {
        session.close();
    }

    public void createTable() {
        // Create the "bus_metrics" table in Cassandra
        session.execute("CREATE TABLE IF NOT EXISTS bus_metrics (bus_id text, timestamp text, route_id text, route_shift text, device_id text, position list<text>, speed double, fuel double, passengers int, PRIMARY KEY ((bus_id), timestamp)");
    }
}

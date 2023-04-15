import pika


def main():

    # Connect to RabbitMQ
    conn = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = conn.channel()
    channel.queue_declare(queue='events', durable=True)

    # Function to process message
    def callback(ch, method, properties, body):
        print(body)
    
    # Setup consumer
    channel.basic_consume(queue='events', on_message_callback=callback, auto_ack=True)

    # Start consuming
    channel.start_consuming()
    conn.close()


if __name__ == '__main__':
    main()

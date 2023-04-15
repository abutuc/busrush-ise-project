import json
import os
from time import sleep
import click
import pika

@click.command()
@click.option('--mode', help='Mode of insertion, it can be weekly or demo')
def main(mode):
    # Connect to RabbitMQ
    conn = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = conn.channel()
    channel.queue_declare(queue='devices', durable=True)
    sleep_time = 0.1
    if mode == 'weekly':
        # Inserting Monday Metrics
        print('Inserting Monday Metrics')
        for metric_file in os.listdir(os.getcwd() + '/metrics/monday/'):
            if metric_file.endswith('.json') == False:
                continue
            fhandle = open(os.getcwd() + '/metrics/monday/' + metric_file, 'r')
            metrics = json.load(fhandle)
            for metric in metrics:
                channel.basic_publish(
                exchange='',
                routing_key='devices',
                body=json.dumps(metric))
                print('Sent: ' + str(json.dumps(metric)))
                sleep(sleep_time)
            
            fhandle.close()
        
        # Inserting Tuesday Metrics
        print('Inserting Tuesday Metrics')
        for metric_file in os.listdir(os.getcwd() + '/metrics/tuesday/'):
            if metric_file.endswith('.json') == False:
                continue
            fhandle = open(os.getcwd() + '/metrics/tuesday/' + metric_file, 'r')
            metrics = json.load(fhandle)
            for metric in metrics:
                channel.basic_publish(
                exchange='',
                routing_key='devices',
                body=json.dumps(metric))
                print('Sent: ' + str(json.dumps(metric)))
                sleep(sleep_time)
            
            fhandle.close()


        # Inserting Wednesday Metrics
        print('Inserting Wednesday Metrics')
        for metric_file in os.listdir(os.getcwd() + '/metrics/wednesday/'):
            if metric_file.endswith('.json') == False:
                continue
            fhandle = open(os.getcwd() + '/metrics/wednesday/' + metric_file, 'r')
            metrics = json.load(fhandle)
            for metric in metrics:
                channel.basic_publish(
                exchange='',
                routing_key='devices',
                body=json.dumps(metric))
                print('Sent: ' + str(json.dumps(metric)))
                sleep(sleep_time)
            
            fhandle.close()
       
        # Inserting Thursday Metrics
        print('Inserting Thursday Metrics')
        for metric_file in os.listdir(os.getcwd() + '/metrics/thursday/'):
            if metric_file.endswith('.json') == False:
                continue
            fhandle = open(os.getcwd() + '/metrics/thursday/' + metric_file, 'r')
            metrics = json.load(fhandle)
            for metric in metrics:
                channel.basic_publish(
                exchange='',
                routing_key='devices',
                body=json.dumps(metric))
                print('Sent: ' + str(json.dumps(metric)))
                sleep(sleep_time)
            
            fhandle.close()
        
        # Inserting Friday Metrics
        print('Inserting Friday Metrics')
        for metric_file in os.listdir(os.getcwd() + '/metrics/friday/'):
            if metric_file.endswith('.json') == False:
                continue
            fhandle = open(os.getcwd() + '/metrics/friday/' + metric_file, 'r')
            metrics = json.load(fhandle)
            for metric in metrics:
                channel.basic_publish(
                exchange='',
                routing_key='devices',
                body=json.dumps(metric))
                print('Sent: ' + str(json.dumps(metric)))
                sleep(sleep_time)
            
            fhandle.close()

if __name__ == '__main__':
    main()

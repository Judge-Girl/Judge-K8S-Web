import {BrokerMessage, BrokerService, Subscriber, Unsubscribe} from '../Services';
import {Observable, of, ReplaySubject} from 'rxjs';
import {RxStomp, RxStompConfig, RxStompState} from '@stomp/rx-stomp';
import {switchMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StompBrokerService extends BrokerService {
  connect$ = new ReplaySubject<void>(1);
  disconnect$ = new ReplaySubject<void>(1);
  stompClient: RxStomp = new RxStomp();
  subscriptions = new Map<string, Subscription>();

  constructor(private stompConfig: RxStompConfig) {
    super();
    this.stompClient.connectionState$.subscribe((state: RxStompState) => {
      if (state === RxStompState.OPEN) {
        this.connect$.next();
        console.log(`Broker reconnected.`);
      }
      if (state === RxStompState.CLOSED) {
        this.disconnect$.next();
        console.log(`Broker disconnected.`);
      }
    });
  }

  connect() {
    if (!this.stompClient.active) {
      this.stompClient.configure(this.stompConfig);
      this.stompClient.activate();
    }
  }

  disconnect() {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }

  subscribe(subscriberName: string, topic: string, subscriber: Subscriber): Unsubscribe {
    if (!topic.startsWith('/')) {
      throw new Error('Topic should start with "/"');
    }
    const key = `${subscriberName}: ${topic}`;
    if (!this.subscriptions.has(key)) {
      const connectSub = this.connect$.subscribe(() => {
        if (!this.subscriptions.has(key)) {
          const destination = `/topic${topic}`;
          console.log(`Subscribing destination: ${destination}...`);
          const subscription = this.stompClient.watch(destination)
            .pipe(switchMap(this.convertToBrokerMessage))
            .subscribe(subscriber);
          this.subscriptions.set(key, new Subscription(subscriberName, topic, subscriber,
            () => {
              connectSub.unsubscribe();
              subscription.unsubscribe();
              this.subscriptions.delete(key);
            }));
        }
      });
    }
    return () => {
      this.subscriptions.get(key)?.unsubscribe();
    };
  }

  convertToBrokerMessage(message): Observable<BrokerMessage> {
    return of(new BrokerMessage(message.command,
      new Map(Object.entries(message.headers)), message.body, message.isBinaryBody, message.binaryBody));
  }

}

class Subscription {
  constructor(public subscriberName: string,
              public topic: string,
              public subscriber: Subscriber,
              public unsubscribe: Unsubscribe) {
  }
}

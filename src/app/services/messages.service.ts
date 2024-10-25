import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Message {
  id: string;
  content: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  link?: {
    text: string;
    url: string;
    type: 'internal' | 'external';
  };
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private readonly displayDurationInMs = environment.messageDisplayDurationInMs;

  constructor() {}

  get messages$(): Observable<Message[]> {
    return this.messagesSubject.asObservable();
  }

  pushMessage(message: Omit<Message, 'id'>): Message {
    const currentMessages = this.messagesSubject.value;
    const newMessage = { ...message, id: this.generateId() };
    this.messagesSubject.next([...currentMessages, newMessage]);

    setTimeout(() => {
      this.removeMessage(newMessage);
    }, this.displayDurationInMs);
    return newMessage;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  public removeMessage(message: Message): void {
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = currentMessages.filter((m) => m.id !== message.id);
    this.messagesSubject.next(updatedMessages);
  }
}

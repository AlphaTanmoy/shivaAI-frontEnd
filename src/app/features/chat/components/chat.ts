import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class ChatComponent implements OnInit {

  message = '';

  loading = false;

  messages: Message[] = [
    {
      role: 'ai',
      content: '🙏 Welcome to Shiva AI. Ask me anything.'
    }
  ];

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const message = history.state.message;

    if (typeof message === 'string' && message.trim()) {

      this.message = message.trim();

      setTimeout(() => {
        this.sendMessage();
      });

    }

  }

  sendMessage(): void {

    if (!this.message.trim() || this.loading) {
      return;
    }

    const userMessage = this.message.trim();

    this.messages.push({
      role: 'user',
      content: userMessage
    });

    this.message = '';

    this.loading = true;

    this.cdr.detectChanges();

    this.chatService.sendMessage({
      message: userMessage
    }).subscribe({

      next: async (response) => {

        const aiMessage: Message = {
          role: 'ai',
          content: ''
        };

        this.messages.push(aiMessage);

        this.cdr.detectChanges();

        await this.typeWriter(response.answer, aiMessage);

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: () => {

        this.messages.push({
          role: 'ai',
          content: '❌ Something went wrong. Please try again.'
        });

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }

  private async typeWriter(
    text: string,
    message: Message
  ): Promise<void> {

    message.content = '';

    for (const char of text) {

      message.content += char;

      this.cdr.detectChanges();

      let delay = 38;

      switch (char) {

        case '.':
        case '!':
        case '?':
          delay = 150;
          break;

        case ',':
          delay = 70;
          break;

        case ' ':
          delay = 8;
          break;

      }

      await this.sleep(delay);

    }

  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
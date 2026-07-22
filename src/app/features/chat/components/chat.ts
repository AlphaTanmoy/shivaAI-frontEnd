import { Component } from '@angular/core';
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
export class ChatComponent {

  message = '';

  loading = false;

  messages: Message[] = [
    {
      role: 'ai',
      content: '🙏 Welcome to Shiva AI. Ask me anything.'
    }
  ];

  constructor(
    private chatService: ChatService
  ) {}

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

    this.chatService.sendMessage({
      message: userMessage
    }).subscribe({

      next: (response) => {

        const aiMessage: Message = {
          role: 'ai',
          content: ''
        };

        this.messages.push(aiMessage);

        this.loading = false;

        this.animateResponse(response.answer, aiMessage);

      },

      error: () => {

        this.messages.push({
          role: 'ai',
          content: '❌ Something went wrong. Please try again.'
        });

        this.loading = false;

      }

    });

  }

  private animateResponse(
    fullText: string,
    message: Message
  ): void {

    let index = 0;

    const typeNextCharacter = () => {

      if (index >= fullText.length) {
        return;
      }

      message.content += fullText[index];
      index++;

      let delay = 18;

      const currentChar = fullText[index - 1];

      if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
        delay = 180;
      } else if (currentChar === ',') {
        delay = 80;
      } else if (currentChar === ' ') {
        delay = 8;
      }

      setTimeout(typeNextCharacter, delay);

    };

    typeNextCharacter();

  }

}
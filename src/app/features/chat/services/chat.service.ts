import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ChatRequest,
  ChatResponse
} from '../models/chat.model';
import { API } from '../../../core/constants/api-list';


@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(
    private http: HttpClient
  ){}



  sendMessage(
    request: ChatRequest
  ): Observable<ChatResponse>{

    return this.http.post<ChatResponse>(
      API.CHAT,
      request
    );

  }


}
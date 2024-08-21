import {Injectable} from "@angular/core";

// @Injectable({providedIn:'root'})
@Injectable() //provided in AppModule
export class LoggingService {
  lastLog: string | undefined;

  printLog(message: string){
    console.log(message);
    console.log('Previous message: ' + this.lastLog);
    this.lastLog = message;
  }
}

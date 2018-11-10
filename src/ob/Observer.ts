export interface IObserver {
	updateData(cmd:number,data:any);
}
export interface ISubject{
    addObserver(observer: IObserver);
    removeObserver(observer: IObserver);
    sendNotif(cmd:number,data?:any);
}
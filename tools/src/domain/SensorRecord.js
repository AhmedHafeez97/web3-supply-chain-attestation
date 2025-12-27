export class SensorRecord {
    constructor({deviceId, seq, ts, tempC_x100, rh_x100, shock_mg, battery_mv}){
        this.deviceId = deviceId;
        this.seq = seq;
        this.ts = ts;
        this.tempC_x100 = tempC_x100;
        this.rh_x100 = rh_x100;
        this.shock_mg = shock_mg;
        this.battery_mv = battery_mv;
        
        Object.freeze(this);
    }
}
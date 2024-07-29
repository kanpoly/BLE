var bluetoothDevice;
var characteristic;
// UUIDの登録
var SERVICE_UUID    = '538b6cdb-d0b6-42d2-962b-fb9cb91c8cd2';   // サービス
var LED1_UUID  		  = '4d29e6e0-6996-4a57-bd27-eaf21bd750f6';   // LED1
var LED2_UUID  		  = 'ab1329eb-0f03-4b35-b12c-d980481c2cf9';   // LED2
var LED3_UUID  		  = 'c6cbb71b-61ca-4b52-9e0d-c412398273b9';   // LED3
var ADC_UUID		    = 'e70eb45c-30e1-49f0-9cde-a5771f918791';   // AD
var SWITCH_UUID		  = '552ab02b-1973-4c3b-87e5-f32384e10481';   // SW

// キャラクタの登録
let led1_Characteristic;
let led2_Characteristic;  
let led3_Characteristic; 
let sw_Characteristic;  
let adc_Characteristic;    
  
  
//ボタンイベントリスナー
d3.select("#connect-button").on("click", connect);
d3.select("#disconnect-button").on("click", disconnect);
d3.select("#led1_send_hi").on("click", send_led1_hi);
d3.select("#led1_send_mid").on("click", send_led1_mid);
d3.select("#led1_send_off").on("click", send_led1_off);

d3.select("#led2_send_hi").on("click", send_led2_hi);
d3.select("#led2_send_mid").on("click", send_led2_mid);
d3.select("#led2_send_off").on("click", send_led2_off);

d3.select("#led3_send_hi").on("click", send_led3_hi);
d3.select("#led3_send_mid").on("click", send_led3_mid);
d3.select("#led3_send_off").on("click", send_led3_off);

d3.select("#sw_get").on("click", get_sw);
d3.select("#adc_get").on("click", get_adc);
  
  
  //デバイスに接続する
function connect() {
  let options = {};
  //  options.acceptAllDevices = true;    // すべてのデバイスを表示
  // 特定のデバイスを表示
  options.filters = [
     {services: [SERVICE_UUID]},         // サービスUUIDの指定
  //    {name: "DEVICE_NAME"}                    // デバイス名の指定
  ];
  
  navigator.bluetooth.requestDevice(options)
  .then(device => {
    bluetoothDevice = device;
    console.log("device", device);
    return device.gatt.connect();
  })
  .then(server =>{
    console.log("server", server)
    return server.getPrimaryService(SERVICE_UUID);
  })
  .then(service => {
    console.log("service", service)
    return Promise.all([
        service.getCharacteristic(LED1_UUID),
        service.getCharacteristic(LED2_UUID),
        service.getCharacteristic(LED3_UUID),
        service.getCharacteristic(ADC_UUID),  
        service.getCharacteristic(SWITCH_UUID)
      ])
    
  })
  .then(characteristic  => {
    console.log("characteristic")
    alert("BLE接続成功");
    document.querySelector("#devicename").value = bluetoothDevice.name;
    led1_Characteristic = characteristic[0];
    led2_Characteristic = characteristic[1];
    led3_Characteristic = characteristic[2];
    adc_Characteristic = characteristic[3];
    sw_Characteristic = characteristic[4];
      console.log("success:connect BLE");    
  })  
  .catch(error => {
    console.log(error);
  });    
}


// led1 Hi 送信
function send_led1_hi() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected ) return ;
  led1_Characteristic.writeValue(new TextEncoder().encode("FF"));        
} 

// led1 MID 送信
function send_led1_mid() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected ) return ;
  led1_Characteristic.writeValue(new TextEncoder().encode("10"));        
} 

  
// led1 off 送信
function send_led1_off() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected ) return ;
  led1_Characteristic.writeValue(new TextEncoder().encode("00"));        
} 
  
// led2 Hi 送信
function send_led2_hi() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected ) return ;
  led2_Characteristic.writeValue(new TextEncoder().encode("FF"));        
} 

// led2 MID 送信
function send_led2_mid() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected ) return ;
  led2_Characteristic.writeValue(new TextEncoder().encode("10"));        
} 

  
// led2 off 送信
function send_led2_off() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected ) return ;
  led2_Characteristic.writeValue(new TextEncoder().encode("00"));        
} 

// led3 Hi 送信
function send_led3_hi() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected ) return ;
  led3_Characteristic.writeValue(new TextEncoder().encode("FF"));        
} 

// led3 MID 送信
function send_led3_mid() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected ) return ;
  led3_Characteristic.writeValue(new TextEncoder().encode("10"));        
} 

  
// led3 off 送信
function send_led3_off() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected ) return ;
  led3_Characteristic.writeValue(new TextEncoder().encode("00"));        
}   

// sw 受信 
function get_sw() {
let sw_val=0;
  try {
      sw_Characteristic.readValue()
      .then(value1 => {
        sw_val = value1;
        console.log(new Uint8Array(sw_val));
        document.querySelector("#val_sw").value = new TextDecoder("utf-8").decode(sw_val);
      });   
  }
  catch (e) {
    console.log(e);
  }
}

// ad 受信 
function get_adc() {
let adc_val=0;
  try {
      adc_Characteristic.readValue()
      .then(value2 => {
        adc_val = value2;
        console.log(new Uint8Array(adc_val));
        document.querySelector("#val_adc").value = new TextDecoder("utf-8").decode(adc_val);
      });   
  }
  catch (e) {
    console.log(e);
  }
}

  
//BLE切断処理
function disconnect() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected) return ;
    document.querySelector("#devicename").value = "未接続";
  bluetoothDevice.gatt.disconnect();
  alert("BLE切断")
}
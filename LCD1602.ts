/**
* makecode LCD1602 package for microbit.
* Based on I2C_LCD1602 package
*/

/**
 * Custom blocks
 */
//% weight=20 color=#0fbc11 icon="▀"
namespace LCD1602 {
    let rs: DigitalPin.P8
    let enable: DigitalPin.P2
    let datapins = [DigitalPin.P16, DigitalPin.P15, DigitalPin.P14, DigitalPin.P13]

    // commands
    let LCD_CLEARDISPLAY = 0x01
    let LCD_RETURNHOME = 0x02
    let LCD_ENTRYMODESET = 0x04
    let LCD_DISPLAYCONTROL = 0x08
    let LCD_CURSORSHIFT = 0x10
    let LCD_FUNCTIONSET = 0x20
    let LCD_SETCGRAMADDR = 0x40
    let LCD_SETDDRAMADDR = 0x80
    
    // flags for display entry mode
    let LCD_ENTRYRIGHT = 0x00
    let LCD_ENTRYLEFT = 0x02
    let LCD_ENTRYSHIFTINCREMENT = 0x01
    let LCD_ENTRYSHIFTDECREMENT = 0x00
    
    // flags for display on/ off control
    let LCD_DISPLAYON = 0x04
    let LCD_DISPLAYOFF = 0x00
    let LCD_CURSORON = 0x02
    let LCD_CURSOROFF = 0x00
    let LCD_BLINKON = 0x01
    let LCD_BLINKOFF = 0x00
    
    // flags for display/ cursor shift
    let LCD_DISPLAYMOVE = 0x08
    let LCD_CURSORMOVE = 0x00
    let LCD_MOVERIGHT = 0x04
    let LCD_MOVELEFT = 0x00
    
    // flags for function set
    let LCD_8BITMODE = 0x10
    let LCD_4BITMODE = 0x00
    let LCD_2LINE = 0x08
    let LCD_1LINE = 0x00
    let LCD_5x10DOTS = 0x04
    let LCD_5x8DOTS = 0x00

    function home(): void {
        send(this.LCD_RETURNHOME, 0)
        basic.pause(2)
    }

    function setCursor(col: number, row: number): void {
        let orpart = col
        if (row > 0) {
            orpart = orpart + 0x40
        }
        send(this.LCD_SETDDRAMADDR | orpart, 0)
    }

    function showText(t: string): void {
        for (let i = 0; i < t.length; i++) {
            send(t.charCodeAt(i), 1)
        }
    }

    // mid and low level commands        
    function send(value: number, mode: number): void {
        pins.digitalWritePin(this.rs, mode)
        write4bits(value >> 4)
        write4bits(value)
    }

    function pulseEnable(): void {
        pins.digitalWritePin(this.enable, 0)
        basic.pause(1)
        pins.digitalWritePin(this.enable, 1)
        basic.pause(1)
        pins.digitalWritePin(this.enable, 0)
        basic.pause(1)
    }

    function write4bits(value: number): void {
        for (let i = 0; i < 4; i++) {
            pins.digitalWritePin(datapins[i], (value >> i) & 0x01)
        }
        pulseEnable()
    }

    /**
     * initial LCD, set I2C address. Address is 39/63 for PCF8574/PCF8574A
     * @param Addr is i2c address for LCD, eg: 0, 39, 63. 0 is auto find address
     */
    //% blockId="LCD1620_SET_ADDRESS" block="LCD initialize with Address %addr"
    //% weight=100 blockGap=8
    //% parts=LCD1602 trackArgs=0
    export function LcdInit() {
        // at least 50ms after power on
        basic.pause(50)
        // send rs, enable low - rw is tied to GND
        pins.digitalWritePin(this.rs, 0);
        pins.digitalWritePin(this.enable, 0)
        write4bits(0x03)
        basic.pause(5)
        write4bits(0x03)
        basic.pause(5)
        write4bits(0x03)
        basic.pause(2)
        write4bits(0x02)
        send(this.LCD_FUNCTIONSET | 0x08, 0)
        basic.pause(5)
        send(this.LCD_FUNCTIONSET | 0x08, 0)
        basic.pause(5)
        send(this.LCD_FUNCTIONSET | 0x08, 0)
        basic.pause(5)
        send(this.LCD_FUNCTIONSET | 0x08, 0)
        basic.pause(5)
        send(this.LCD_DISPLAYCONTROL | this.LCD_DISPLAYON | this.LCD_CURSOROFF | this.LCD_BLINKOFF, 0)
        clear()
        send(this.LCD_ENTRYMODESET | this.LCD_ENTRYLEFT | this.LCD_ENTRYSHIFTDECREMENT, 0)
    }

    /**
     * show a number in LCD at given position
     * @param n is number will be show, eg: 10, 100, 200
     * @param x is LCD column position, eg: 0
     * @param y is LCD row position, eg: 0
     */
    //% blockId="LCD1620_SHOW_NUMBER" block="show number %n|at x %x|y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    //% parts=LCD1602 trackArgs=0
    export function ShowNumber(n: number, x: number, y: number): void {
        let s = n.toString()
        ShowString(s, x, y)
    }

    /**
     * show a string in LCD at given position
     * @param s is string will be show, eg: "Hello"
     * @param x is LCD column position, [0 - 15], eg: 0
     * @param y is LCD row position, [0 - 1], eg: 0
     */
    //% blockId="LCD1620_SHOW_STRING" block="show string %s|at x %x|y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    //% parts=LCD1602 trackArgs=0
    export function ShowString(s: string, x: number, y: number): void {
        setCursor(x, y)
        showText(s)
    }

    /**
     * turn on LCD
     */
    //% blockId="LCD1620_ON" block="turn on LCD"
    //% weight=81 blockGap=8
    //% parts=LCD1602 trackArgs=0
    export function on(): void {
        send(this.LCD_DISPLAYON, 0)
        basic.pause(2)
    }

    /**
     * turn off LCD
     */
    //% blockId="LCD1620_OFF" block="turn off LCD"
    //% weight=80 blockGap=8
    //% parts=LCD1602 trackArgs=0
    export function off(): void {
        send(this.LCD_DISPLAYOFF, 0)
        basic.pause(2)
    }

    /**
     * clear all display content
     */
    //% blockId="LCD1620_CLEAR" block="clear LCD"
    //% weight=85 blockGap=8
    //% parts=LCD1602 trackArgs=0
    export function clear(): void {
        send(this.LCD_CLEARDISPLAY, 0)
        basic.pause(2)
    }

    /**
     * shift left
     */
    //% blockId="LCD1620_SHL" block="Shift Left"
    //% weight=61 blockGap=8
    //% parts=LCD1602 trackArgs=0
    export function shl(): void {
        send(this.LCD_MOVELEFT, 0)
        basic.pause(2)
    }

    /**
     * shift right
     */
    //% blockId="LCD1620_SHR" block="Shift Right"
    //% weight=60 blockGap=8
    //% parts=LCD1602 trackArgs=0
    export function shr(): void {
        send(this.LCD_MOVERIGHT, 0)
        basic.pause(2)
    }
}

---
title: How to Make a Line Following Robot (LFR)
description: This is a guide on how to build a Line Following Robot (LFR) using basic components.
slug: line-following-robot
date: 02/03/2025
author: Abhiman Raj
image: /blogsimg/lfr.png

---

## Introduction

A Line Following Robot (LFR) is an autonomous robot that can detect and follow a line drawn on a surface. This guide will walk you through the complete process of building your own LFR, from understanding the basic concepts to programming and troubleshooting.

---

## Table of Contents

1. [How It Works](#how-it-works)
2. [Components Required](#components-required)
3. [Circuit Design](#circuit-design)
4. [Assembly Instructions](#assembly-instructions)
5. [Programming](#programming)
6. [Calibration and Testing](#calibration-and-testing)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Tips](#advanced-tips)

---

## How It Works

The Line Following Robot operates on a simple principle:

1. **Sensors detect the line**: IR sensors distinguish between the dark line and the light surface
2. **Microcontroller processes data**: The controller reads sensor values and makes decisions
3. **Motors respond**: Based on sensor input, motors adjust speed and direction to keep the robot on track

### Basic Logic

- **On the line**: Both motors run at equal speed (robot moves forward)
- **Deviating left**: Right motor speeds up, left motor slows down (robot turns right)
- **Deviating right**: Left motor speeds up, right motor slows down (robot turns left)

---

## Components Required

### Essential Components

| Component | Quantity | Specifications |
|-----------|----------|----------------|
| Microcontroller | 1 | Arduino Uno / ESP32 / STM32 |
| IR Sensors | 2-5 | TCRT5000 or similar |
| DC Motors | 2 | 100-300 RPM with gear reduction |
| Motor Driver | 1 | L298N or L293D |
| Chassis | 1 | Acrylic or 3D printed |
| Wheels | 2 | Compatible with motors |
| Castor Wheel | 1 | Front or rear support |
| Battery | 1 | 7.4V Li-Po or 9V battery pack |
| Jumper Wires | As needed | Male-to-male, male-to-female |
| Breadboard (optional) | 1 | For prototyping |

### Optional Components

- Display (OLED/LCD) for debugging
- Buzzer for alerts
- LEDs for status indication
- Switch for power control

---

## Circuit Design

### IR Sensor Connections

Each IR sensor typically has 3 pins:
- **VCC** → 5V from Arduino
- **GND** → Ground
- **OUT** → Digital pin on Arduino (D2, D3, D4, etc.)

### Motor Driver Connections (L298N)

**Motor A (Left Motor):**
- IN1 → Arduino Pin 8
- IN2 → Arduino Pin 9
- ENA → Arduino Pin 10 (PWM)

**Motor B (Right Motor):**
- IN3 → Arduino Pin 11
- IN4 → Arduino Pin 12
- ENB → Arduino Pin 13 (PWM)

**Power:**
- 12V input → Battery positive
- GND → Battery negative and Arduino GND
- 5V output → Can power Arduino (if motor driver has voltage regulator)

### Basic Wiring Diagram

```
Arduino         L298N          Motors
-------         -----          ------
Pin 8    →      IN1
Pin 9    →      IN2
Pin 10   →      ENA
                OUT1    →      Left Motor +
                OUT2    →      Left Motor -

Pin 11   →      IN3
Pin 12   →      IN4
Pin 13   →      ENB
                OUT3    →      Right Motor +
                OUT4    →      Right Motor -

5V       →      5V (sensors)
GND      →      GND (common)

IR Sensors:
Pin 2    ←      Left Sensor OUT
Pin 3    ←      Center Sensor OUT (optional)
Pin 4    ←      Right Sensor OUT
```

---

## Assembly Instructions

### Step 1: Prepare the Chassis

1. Cut or print a chassis (approximately 15cm x 10cm)
2. Mark positions for motors, sensors, and electronics
3. Drill mounting holes if using acrylic

### Step 2: Mount the Motors

1. Attach motors to the rear of the chassis using clamps or screws
2. Ensure motors are parallel and aligned
3. Attach wheels to motor shafts
4. Mount castor wheel at the front/rear

### Step 3: Install IR Sensors

1. Mount sensors at the front of the chassis
2. Position them 2-5mm above the ground
3. Space sensors 2-3cm apart
4. Angle slightly downward for optimal detection

**Sensor Configurations:**
- **2-sensor setup**: Left and Right (basic line following)
- **3-sensor setup**: Left, Center, Right (better accuracy)
- **5-sensor setup**: Maximum precision for complex tracks

### Step 4: Mount Electronics

1. Secure the motor driver to the chassis
2. Place Arduino on the chassis (use standoffs or double-sided tape)
3. Position battery pack securely
4. Leave space for cable management

### Step 5: Wiring

1. Connect motors to the motor driver
2. Wire IR sensors to Arduino digital pins
3. Connect motor driver to Arduino
4. Connect power supply
5. Use zip ties to organize cables

---

## Programming

### Basic Arduino Code (2-Sensor)

```cpp
// Pin definitions
const int leftSensor = 2;
const int rightSensor = 4;

const int leftMotorIN1 = 8;
const int leftMotorIN2 = 9;
const int leftMotorENA = 10;

const int rightMotorIN3 = 11;
const int rightMotorIN4 = 12;
const int rightMotorENB = 13;

// Motor speed
int baseSpeed = 150; // 0-255

void setup() {
  // Set sensor pins as input
  pinMode(leftSensor, INPUT);
  pinMode(rightSensor, INPUT);
  
  // Set motor pins as output
  pinMode(leftMotorIN1, OUTPUT);
  pinMode(leftMotorIN2, OUTPUT);
  pinMode(leftMotorENA, OUTPUT);
  pinMode(rightMotorIN3, OUTPUT);
  pinMode(rightMotorIN4, OUTPUT);
  pinMode(rightMotorENB, OUTPUT);
  
  Serial.begin(9600);
}

void loop() {
  int leftValue = digitalRead(leftSensor);
  int rightValue = digitalRead(rightSensor);
  
  // Display sensor values for debugging
  Serial.print("Left: ");
  Serial.print(leftValue);
  Serial.print(" | Right: ");
  Serial.println(rightValue);
  
  // Line following logic (assuming LOW = line detected)
  if (leftValue == LOW && rightValue == LOW) {
    // Both sensors on line - move forward
    moveForward();
  }
  else if (leftValue == HIGH && rightValue == LOW) {
    // Line on right - turn right
    turnRight();
  }
  else if (leftValue == LOW && rightValue == HIGH) {
    // Line on left - turn left
    turnLeft();
  }
  else {
    // No line detected - stop or search
    stopMotors();
  }
  
  delay(10);
}

void moveForward() {
  digitalWrite(leftMotorIN1, HIGH);
  digitalWrite(leftMotorIN2, LOW);
  analogWrite(leftMotorENA, baseSpeed);
  
  digitalWrite(rightMotorIN3, HIGH);
  digitalWrite(rightMotorIN4, LOW);
  analogWrite(rightMotorENB, baseSpeed);
}

void turnLeft() {
  digitalWrite(leftMotorIN1, LOW);
  digitalWrite(leftMotorIN2, HIGH);
  analogWrite(leftMotorENA, baseSpeed * 0.5);
  
  digitalWrite(rightMotorIN3, HIGH);
  digitalWrite(rightMotorIN4, LOW);
  analogWrite(rightMotorENB, baseSpeed);
}

void turnRight() {
  digitalWrite(leftMotorIN1, HIGH);
  digitalWrite(leftMotorIN2, LOW);
  analogWrite(leftMotorENA, baseSpeed);
  
  digitalWrite(rightMotorIN3, LOW);
  digitalWrite(rightMotorIN4, HIGH);
  analogWrite(rightMotorENB, baseSpeed * 0.5);
}

void stopMotors() {
  digitalWrite(leftMotorIN1, LOW);
  digitalWrite(leftMotorIN2, LOW);
  analogWrite(leftMotorENA, 0);
  
  digitalWrite(rightMotorIN3, LOW);
  digitalWrite(rightMotorIN4, LOW);
  analogWrite(rightMotorENB, 0);
}
```

### PID Control (Advanced)

For smoother and faster line following, implement PID control:

```cpp
// PID constants
float Kp = 25;  // Proportional
float Ki = 0;   // Integral
float Kd = 15;  // Derivative

int lastError = 0;
int integral = 0;

void loop() {
  int error = calculateError(); // Based on sensor readings
  
  integral += error;
  int derivative = error - lastError;
  
  int correction = (Kp * error) + (Ki * integral) + (Kd * derivative);
  
  int leftSpeed = baseSpeed + correction;
  int rightSpeed = baseSpeed - correction;
  
  // Constrain speeds
  leftSpeed = constrain(leftSpeed, 0, 255);
  rightSpeed = constrain(rightSpeed, 0, 255);
  
  setMotorSpeeds(leftSpeed, rightSpeed);
  
  lastError = error;
  delay(10);
}
```

---

## Calibration and Testing

### Sensor Calibration

1. **Test on white surface**: Note the sensor output (typically HIGH)
2. **Test on black line**: Note the sensor output (typically LOW)
3. **Adjust sensor height**: Optimal distance is 2-5mm from the surface
4. **Adjust potentiometer**: Some sensors have adjustable sensitivity

### Motor Calibration

1. Test both motors independently at the same speed
2. If one motor is faster, adjust the speed values in code
3. Use PWM values to match motor speeds

### Track Preparation

1. Use black electrical tape (2-3cm wide) on white surface
2. Ensure good contrast between line and background
3. Start with gentle curves before attempting sharp turns
4. Keep track smooth and clean

### Testing Procedure

1. **Static test**: Verify sensors detect the line correctly
2. **Straight line test**: Test forward movement
3. **Curve test**: Test turning capability
4. **Full track test**: Run complete course
5. **Speed optimization**: Gradually increase speed while maintaining accuracy

---

## Troubleshooting

### Robot doesn't move

- Check battery voltage and connections
- Verify motor driver wiring
- Test motors individually with simple code
- Check if motor driver is receiving power

### Sensors not detecting line

- Verify sensor power connections
- Adjust sensor height (should be 2-5mm from surface)
- Check sensor polarity (some output HIGH on black, others LOW)
- Clean sensor lenses
- Adjust sensitivity potentiometer

### Robot moves but doesn't follow line

- Verify sensor output logic in Serial Monitor
- Check if sensor values match your code logic
- Ensure sensors are properly aligned
- Adjust base speed (may be too fast)

### Robot follows line but jerks/oscillates

- Reduce base speed
- Implement PID control
- Add smoother turning logic
- Check for mechanical issues (wheel alignment)

### One motor not working

- Check specific motor connections
- Test motor driver channels independently
- Verify PWM pins are connected correctly
- Check for burnt motor driver

---

## Advanced Tips

### Performance Optimization

1. **Use more sensors**: 3-5 sensor array provides better accuracy
2. **Implement PID control**: Smoother and faster line following
3. **Optimize weight distribution**: Keep center of gravity low and centered
4. **Use better motors**: Higher RPM with encoders for precise control

### Competition Strategies

1. **Start with reliability**: Get consistent performance before optimizing speed
2. **Test extensively**: Practice on different track configurations
3. **Battery management**: Use fully charged batteries for competitions
4. **Code optimization**: Remove delays where possible, use interrupts

### Track Reading Patterns

For 5-sensor setup, implement weighted positioning:

```cpp
// Sensor positions: -2, -1, 0, 1, 2
int position = (-2 * s1) + (-1 * s2) + (0 * s3) + (1 * s4) + (2 * s5);
```

### Adding Features

- **Speed control**: Use potentiometer to adjust speed on the fly
- **Line counting**: Detect perpendicular lines to track laps
- **Wireless debugging**: Use Bluetooth module for real-time monitoring
- **Obstacle detection**: Add ultrasonic sensor for obstacle avoidance

---

## Resources for Iris Robotics Club

### Recommended Learning Path

1. Start with 2-sensor basic LFR
2. Add third sensor for improved performance
3. Implement PID control
4. Experiment with 5-sensor array
5. Participate in competitions

### Safety Guidelines

- Always disconnect battery when working on electronics
- Check for short circuits before powering on
- Use appropriate voltage ratings for components
- Work in well-ventilated area when soldering
- Wear safety glasses when cutting materials

### Next Steps

- Join LFR competitions (Robowars, Techfests)
- Explore maze-solving robots
- Build gesture-controlled robots
- Experiment with computer vision-based line following

---

## Conclusion

Building a Line Following Robot is an excellent introduction to robotics, combining electronics, programming, and mechanical design. Start simple, test frequently, and gradually add complexity. Most importantly, learn from failures and keep experimenting!

**Happy Building! 🤖**

*Iris Robotics Club - Empowering Innovation*

---

## Contact & Support

For questions or support, reach out to your Iris Robotics Club mentors or check our club resources and documentation.

*Document Version: 1.0*  
*Last Updated: October 2025*
import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  temperature: number | null = null;
  weatherIconUrl: string | null = null;
  cityName: string | null = null; // We'll fetch the city name dynamically

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getLocationAndWeather();
  }

  // Use Geolocation API to get user's location
  getLocationAndWeather(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.getWeather(lat, lon);  // Fetch weather using the coordinates
        },
        error => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  // Fetch weather data using the user's coordinates
  getWeather(lat: number, lon: number): void {
    this.weatherService.getWeatherByCoordinates(lat, lon).subscribe(
      data => {
        this.temperature = data.main.temp;
        this.cityName = data.name; // Extract city name from the API response
        const iconCode = data.weather[0].icon;
        this.weatherIconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
      },
      error => {
        console.error('Error fetching weather data', error);
      }
    );
  }

  // Helper to format the temperature with two decimal places
  getFormattedTemperature(): string {
    return this.temperature !== null ? this.temperature.toFixed(2) : '';
  }
}

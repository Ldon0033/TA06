function buildAdvice(data) {
    const uvi = data.uvi;
    const risk = data.uv_risk || "Unavailable";
  
    if (uvi === null || uvi === undefined) {
      return "Weather data is available, but UV data is currently unavailable. Basic sun protection is still recommended for longer outdoor time.";
    }
  
    if (uvi < 3) {
      return "UV is low. Basic protection is usually enough, but sunglasses are still a good idea.";
    } else if (uvi < 6) {
      return "UV is moderate. Use sunscreen and think about shade during longer outdoor time.";
    } else if (uvi < 8) {
      return "UV is high. Wear sunscreen, a hat, sunglasses, and try to reduce direct exposure.";
    } else if (uvi < 11) {
      return "UV is very high. Strong protection is important and shade breaks are recommended.";
    }
    return "UV is extreme. Limit direct sun exposure where possible and use full protection.";
  }
  
  function updateWeatherUI(data) {
    const cityText = data.country ? `${data.city}, ${data.country}` : data.city;
  
    document.getElementById("resultCity").textContent = cityText;
    document.getElementById("resultDesc").textContent = data.description;
    document.getElementById("resultTemp").textContent = `${data.temperature} °C`;
    document.getElementById("resultFeelsLike").textContent = `${data.feels_like} °C`;
    document.getElementById("resultHumidity").textContent = `${data.humidity} %`;
    document.getElementById("resultWind").textContent = `${data.wind_speed} m/s`;
    document.getElementById("resultUvi").textContent =
      data.uvi === null || data.uvi === undefined ? "--" : data.uvi;
      const uvRiskElement = document.getElementById("resultUvRisk");
      const uvRisk = data.uv_risk || "--";
      
      uvRiskElement.textContent = uvRisk;
      uvRiskElement.className = "";
      
      if (uvRisk === "Low") {
        uvRiskElement.classList.add("uv-low");
      } else if (uvRisk === "Moderate") {
        uvRiskElement.classList.add("uv-moderate");
      } else if (uvRisk === "High") {
        uvRiskElement.classList.add("uv-high");
      } else if (uvRisk === "Very High") {
        uvRiskElement.classList.add("uv-very-high");
      } else if (uvRisk === "Extreme") {
        uvRiskElement.classList.add("uv-extreme");
      }
  
    const icon = document.getElementById("weatherIcon");
    if (data.icon) {
      icon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
      icon.style.display = "block";
    } else {
      icon.style.display = "none";
    }
  
    const advice = buildAdvice(data);
    document.getElementById("adviceBox").textContent = advice;
  
    const badge = document.getElementById("heroUvBadge");
    badge.textContent =
      data.uvi === null || data.uvi === undefined ? "UV --" : `UV ${data.uvi}`;
    
    // 先恢复成基础圆形样式
    badge.className = "uv-badge";
    
    // 再根据 UV risk 叠加颜色 class
    if (uvRisk === "Low") {
      badge.classList.add("uv-badge-low");
    } else if (uvRisk === "Moderate") {
      badge.classList.add("uv-badge-moderate");
    } else if (uvRisk === "High") {
      badge.classList.add("uv-badge-high");
    } else if (uvRisk === "Very High") {
      badge.classList.add("uv-badge-very-high");
    } else if (uvRisk === "Extreme") {
      badge.classList.add("uv-badge-extreme");
    }
    document.getElementById("heroReminder").textContent = advice;
    document.getElementById("statusBox").textContent = "Weather and UV data loaded successfully.";
  }
  
  async function getWeatherByCity() {
    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();
    const statusBox = document.getElementById("statusBox");
  
    if (!city) {
      statusBox.textContent = "Please enter a city name.";
      return;
    }
  
    statusBox.textContent = "Loading weather and UV data...";
  
    try {
      const response = await fetch(`/api/weather-by-city?city=${encodeURIComponent(city)}`);
      const data = await response.json();
  
      if (!response.ok) {
        statusBox.textContent = data.error || "Something went wrong.";
        return;
      }
  
      updateWeatherUI(data);
    } catch (error) {
      statusBox.textContent = "Could not connect to the server.";
      console.error(error);
    }
  }
  
  function useMyLocation() {
    const statusBox = document.getElementById("statusBox");
  
    if (!navigator.geolocation) {
      statusBox.textContent = "Geolocation is not supported by your browser.";
      return;
    }
  
    statusBox.textContent = "Getting your location...";
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        statusBox.textContent = "Loading weather and UV data for your location...";
  
        try {
          const response = await fetch(`/api/weather-by-coords?lat=${lat}&lon=${lon}`);
          const data = await response.json();
  
          if (!response.ok) {
            statusBox.textContent = data.error || "Something went wrong.";
            return;
          }
  
          updateWeatherUI(data);
        } catch (error) {
          statusBox.textContent = "Could not connect to the server.";
          console.error(error);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          statusBox.textContent = "Location access was denied.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          statusBox.textContent = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          statusBox.textContent = "Location request timed out.";
        } else {
          statusBox.textContent = "An unknown geolocation error occurred.";
        }
      }
    );
  }

  function updateSkinTonePreview() {
    const skinTone = document.getElementById("skinTone").value;
    const swatch = document.getElementById("skinToneSwatch");
    const label = document.getElementById("skinToneLabel");
    const note = document.getElementById("skinToneNote");
  
    swatch.className = "skin-swatch";
  
    if (skinTone === "very-fair") {
      swatch.classList.add("skin-very-fair");
      label.textContent = "Very fair";
      note.textContent = "Very limited natural UV tolerance. Strong protection is recommended in higher UV conditions.";
    } else if (skinTone === "fair") {
      swatch.classList.add("skin-fair");
      label.textContent = "Fair";
      note.textContent = "Fair skin can burn relatively quickly under higher UV exposure.";
    } else if (skinTone === "medium") {
      swatch.classList.add("skin-medium");
      label.textContent = "Medium";
      note.textContent = "Moderate natural protection, but regular UV protection is still recommended.";
    } else if (skinTone === "olive") {
      swatch.classList.add("skin-olive");
      label.textContent = "Olive / Brown";
      note.textContent = "Somewhat higher natural UV tolerance, but extended exposure still requires protection.";
    } else if (skinTone === "dark") {
      swatch.classList.add("skin-dark");
      label.textContent = "Dark";
      note.textContent = "Lower immediate burn risk, but UV protection remains important for long-term skin health.";
    }
  }
  
  async function getCurrentUvForSkinTool() {
    const resultBox = document.getElementById("skinToneResult");
    const uvInput = document.getElementById("manualUvLevel");
  
    if (!navigator.geolocation) {
      resultBox.textContent = "Geolocation is not supported by your browser.";
      return;
    }
  
    resultBox.textContent = "Getting your current location and UV level...";
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        try {
          const response = await fetch(`/api/weather-by-coords?lat=${lat}&lon=${lon}`);
          const data = await response.json();
  
          if (!response.ok) {
            resultBox.textContent = data.error || "Unable to load UV data.";
            return;
          }
  
          if (data.uvi === null || data.uvi === undefined) {
            resultBox.textContent = "UV data is currently unavailable for your location.";
            return;
          }
  
          uvInput.value = data.uvi;
          resultBox.textContent = `Current UV level detected successfully: ${data.uvi}`;
        } catch (error) {
          resultBox.textContent = "Could not connect to the server.";
          console.error(error);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          resultBox.textContent = "Location access was denied.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          resultBox.textContent = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          resultBox.textContent = "Location request timed out.";
        } else {
          resultBox.textContent = "An unknown geolocation error occurred.";
        }
      }
    );
  }
  
  function getSkinToneAdvice() {
    const skinTone = document.getElementById("skinTone").value;
    const uvLevel = parseFloat(document.getElementById("manualUvLevel").value);
    const resultBox = document.getElementById("skinToneResult");
  
    if (isNaN(uvLevel)) {
      resultBox.textContent = "Please enter a valid UV level or use your current UV.";
      return;
    }
  
    let skinLabel = "";
    let estimatedTime = "";
    let advice = "";
    let protectionLevel = "";
  
    if (skinTone === "very-fair") {
      skinLabel = "Very fair";
      if (uvLevel < 3) {
        estimatedTime = "30–40 minutes";
        protectionLevel = "Basic";
        advice = "Basic protection is recommended. Consider sunglasses and light protective clothing.";
      } else if (uvLevel < 6) {
        estimatedTime = "20–30 minutes";
        protectionLevel = "Moderate";
        advice = "Use sunscreen and seek shade during longer outdoor exposure.";
      } else if (uvLevel < 8) {
        estimatedTime = "15–20 minutes";
        protectionLevel = "High";
        advice = "High sensitivity. Wear sunscreen, a hat, and reduce direct sun exposure.";
      } else {
        estimatedTime = "10–15 minutes";
        protectionLevel = "Very High";
        advice = "Very high sensitivity. Strong sun protection is essential and outdoor exposure should be limited.";
      }
    } else if (skinTone === "fair") {
      skinLabel = "Fair";
      if (uvLevel < 3) {
        estimatedTime = "40–50 minutes";
        protectionLevel = "Basic";
        advice = "Basic protection is usually enough, especially for shorter outdoor time.";
      } else if (uvLevel < 6) {
        estimatedTime = "25–35 minutes";
        protectionLevel = "Moderate";
        advice = "Use sunscreen and monitor your exposure during midday hours.";
      } else if (uvLevel < 8) {
        estimatedTime = "20–25 minutes";
        protectionLevel = "High";
        advice = "Protection is strongly recommended, including sunscreen and shade planning.";
      } else {
        estimatedTime = "15–20 minutes";
        protectionLevel = "Very High";
        advice = "High UV conditions require strong protection and shorter direct exposure.";
      }
    } else if (skinTone === "medium") {
      skinLabel = "Medium";
      if (uvLevel < 3) {
        estimatedTime = "50–60 minutes";
        protectionLevel = "Basic";
        advice = "Low UV conditions are generally manageable, but protection is still advisable for longer exposure.";
      } else if (uvLevel < 6) {
        estimatedTime = "35–45 minutes";
        protectionLevel = "Moderate";
        advice = "Use sunscreen and protective accessories during longer outdoor time.";
      } else if (uvLevel < 8) {
        estimatedTime = "25–35 minutes";
        protectionLevel = "High";
        advice = "Moderate sensitivity. Regular sun protection is recommended.";
      } else {
        estimatedTime = "20–25 minutes";
        protectionLevel = "Very High";
        advice = "Use stronger protection and reduce unprotected outdoor exposure.";
      }
    } else if (skinTone === "olive") {
      skinLabel = "Olive / Brown";
      if (uvLevel < 3) {
        estimatedTime = "60–75 minutes";
        protectionLevel = "Basic";
        advice = "Lower UV conditions present less immediate risk, but protection remains beneficial.";
      } else if (uvLevel < 6) {
        estimatedTime = "45–55 minutes";
        protectionLevel = "Moderate";
        advice = "Use sunscreen for extended outdoor activities.";
      } else if (uvLevel < 8) {
        estimatedTime = "30–40 minutes";
        protectionLevel = "High";
        advice = "Protection is recommended, especially during peak UV hours.";
      } else {
        estimatedTime = "25–30 minutes";
        protectionLevel = "Very High";
        advice = "High UV can still cause damage. Sunscreen and shade are recommended.";
      }
    } else if (skinTone === "dark") {
      skinLabel = "Dark";
      if (uvLevel < 3) {
        estimatedTime = "75+ minutes";
        protectionLevel = "Basic";
        advice = "Immediate UV risk is lower, but general skin protection is still recommended.";
      } else if (uvLevel < 6) {
        estimatedTime = "55–70 minutes";
        protectionLevel = "Moderate";
        advice = "Protection is still beneficial during extended time outdoors.";
      } else if (uvLevel < 8) {
        estimatedTime = "40–50 minutes";
        protectionLevel = "High";
        advice = "Use sunscreen and avoid assuming full protection from darker skin tone alone.";
      } else {
        estimatedTime = "30–40 minutes";
        protectionLevel = "Very High";
        advice = "High UV still presents a risk. Use sunscreen, shade, and protective clothing.";
      }
    }
  
    resultBox.innerHTML = `
      <strong>Skin tone / type:</strong> ${skinLabel}<br>
      <strong>UV level:</strong> ${uvLevel}<br>
      <strong>Estimated safe exposure time:</strong> ${estimatedTime}<br>
      <strong>Personalised advice:</strong> ${advice}
    `;
  
    document.getElementById("summarySkinTone").textContent = skinLabel;
    document.getElementById("summaryUv").textContent = uvLevel;
    document.getElementById("summaryExposure").textContent = estimatedTime;
    document.getElementById("summaryProtection").textContent = protectionLevel;
    document.getElementById("summaryAdvice").textContent = advice;
  }

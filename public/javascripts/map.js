import * as coordinatesApis from "./RUcities.json" assert { type: "json" };

const colors = ['white', 'silver', 'orange', 'yellow', 'green'];
const limits = [5, 10, 20, 50];
const minZoom = 3;
const maxZoom = 10;

export default class Map {
  constructor(summaryData) {
    this.summaryData = summaryData;
    this.jsonCountryCoordinates = null;
    this.arrCountryCodes = [];
    this.coordinates = [];
    this.cities = {};
    this.x = 0;
    this.y = 0;
  }

  getMap() {
    if (this.summaryData) {
      const { city } = this.summaryData;
      if (city.length) {
        city.map((city) => {
          if (this.cities[city.city]) this.cities[city.city] += 1;
          else this.cities[city.city] = 1;
        });
      };
    }
    this.getMouseCoordinate();
    const tooltip = document.createElement("div");
    tooltip.classList.add("map__tooltip", "map__tooltip--hide");
    document.querySelector(".grid-wrapper").appendChild(tooltip);

    this.getCitiesCoordinates();

    const mapOptions = { minZoom, maxZoom };

    const map = new L.map("map", mapOptions);
    map.setView([60, 60], 4);

    const layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      noWrap: true,
      bounds: [
        [-90, -180],
        [90, 180],
      ],
    });

    // Adding layer to the map
    map.addLayer(layer);

    this.coordinates.forEach((item) => {
      const circleCenter = [item.latitude, item.longitude];

      const value = item.population;
      let circleRadius;
      let circleColor;
      if (value < limits[0]) {
        circleRadius = 4;
        circleColor = colors[0];
      } else if (value < limits[1]) {
        circleRadius = 6;
        circleColor = colors[1];
      } else if (value < limits[2]) {
        circleRadius = 8;
        circleColor = colors[2];
      } else if (value < limits[3]) {
        circleRadius = 9;
        circleColor = colors[3];
      } else {
        circleRadius = 10;
        circleColor = colors[4];
      }

      const circle = L.circleMarker(circleCenter, {
        radius: circleRadius,
        id: item.country_code,
        val: value,
      });
      circle.setStyle({ color: circleColor });
      circle.addTo(map);

      circle.addEventListener("mouseover", (e) => {
        tooltip.style.top = `${this.y + 20}px`;
        tooltip.style.left = `${this.x + 10}px`;
        tooltip.classList.remove("map__tooltip--hide");
        tooltip.innerHTML = `${item.name}<br>${value}`;
      });

      circle.addEventListener("mouseout", () => {
        tooltip.classList.add("map__tooltip--hide");
      });

      // circle.addEventListener("click", (e) => { console.log(e.target.options) });
    });


    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = (map) => {
      const div = L.DomUtil.create("div", "map__legend");
      div.innerHTML += `<i style=\"background: ${colors[0]}\"></i><span>1-${limits[0]}</span><br>`;
      div.innerHTML += `<i style=\"background: ${colors[1]}\"></i><span>${limits[0]}-${limits[1]}</span ><br>`;
      div.innerHTML += `<i style=\"background: ${colors[2]}\"></i><span>${limits[1]}-${limits[2]}</span><br>`;
      div.innerHTML += `<i style=\"background: ${colors[3]}\"></i><span>${limits[2]}-${limits[3]}</span><br>`;
      div.innerHTML += `<i style=\"background: ${colors[4]}\"></i><span>>${limits[3]}</span><br>`;
      return div;
    };

    legend.addTo(map);
  }

  async getCitiesCoordinates() {
    this.jsonCountryCoordinates = coordinatesApis;

    this.jsonCountryCoordinates.default.map((i) => {
      if (this.cities[i.city]) {
        const obj = {};
        obj.name = i.city;
        obj.latitude = i.lat;
        obj.longitude = i.long;
        obj.population = this.cities[i.city];
        this.coordinates.push(obj);
      }
    });
  }

  getMouseCoordinate() {
    document.querySelector("#map").addEventListener("mousemove", (e) => {
      this.x = e.pageX;
      this.y = e.pageY;
    }, false);
  }
}

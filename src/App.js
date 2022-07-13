import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Button,
  Box,
  Icon,
  Typography,
  IconButton,
  CircularProgress,
  TextField,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  SmallCard,
  LargeCard,
  Compass,
  LinearProgressWithLabel,
} from "components"; // Importo asi con lo de jsconfig.json
import measurementContext from "contexts/measurementContext";

import { formatCurrentDate } from "utils";

const MeasurementButtons = ({ children }) => {
  const { measurement, setMeasurement } = useContext(measurementContext);
  return (
    <Box sx={style.temperatureContainer}>
      <IconButton
        aria-label="Farenheit"
        onClick={() => {
          setMeasurement("F");
        }}
      >
        <Icon
          sx={
            measurement === "F" ? buttonStyle.buttonOn : buttonStyle.buttonOff
          }
          disabled={measurement === "F"}
        >
          °F
        </Icon>
      </IconButton>
      <IconButton
        onClick={() => {
          setMeasurement("C");
        }}
      >
        <Icon
          sx={
            measurement === "C" ? buttonStyle.buttonOn : buttonStyle.buttonOff
          }
          disabled={measurement === "C"}
        >
          °C
        </Icon>
      </IconButton>
    </Box>
  );
};

const LeftBox = ({
  weekData,
  measurement,
  setLocation,
  setIsLoading,
  getDataFromAPI,
}) => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [historial, setHistorial] = useState([]);
  const [disabledButton, setDisabledButton] = useState(true);

  const handleSideBarOpen = () => {
    setOpenSideBar(true);
  };
  const handleSideBarClose = () => {
    setOpenSideBar(false);
  };

  const handleSearchChange = useCallback(
    async (value) => {
      if (searchText.length > 2) {
        await axios
          .request({
            method: "GET",
            url: `https://api.weatherapi.com/v1/search.json`,
            params: {
              key: process.env.REACT_APP_API_KEY,
              q: searchText,
            },
          })
          .then((response) => {
            setLocationList(response.data.map((location) => location.name));
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    [searchText]
  );

  useEffect(() => {
    if (searchText.length > 2) {
      handleSearchChange(searchText);
      setDisabledButton(false);
    }
  }, [searchText, handleSearchChange]);

  const handleButtonClick = async (location) => {
    setLocation(location);
    if (historial.length < 5) {
      setHistorial([location, ...historial]);
    } else {
      setHistorial([location, ...historial.slice(0, -1)]);
    }
    setSearchText("");
    setDisabledButton(true);
    getDataFromAPI(location);
    setOpenSideBar(false);
  };

  const handleLocationClick = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const result = await axios.request({
          method: "GET",
          url: `https://api.weatherapi.com/v1/search.json`,
          params: {
            key: process.env.REACT_APP_API_KEY,
            q: lat + "," + lon,
          },
        });
        setLocation(result.data[0].name);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <Box sx={style.leftBox}>
      <Box sx={style.topContainer}>
        <Button sx={style.searchButton} onClick={handleSideBarOpen}>
          Search for places
        </Button>
        <IconButton
          onClick={handleLocationClick}
          aria-label="delete"
          sx={{ color: "white" }}
        >
          <GpsFixedIcon sx={style.gpsButton} />
        </IconButton>
      </Box>
      <Box sx={{ textAlign: "center", padding: "60px" }}>
        <img
          src={weekData.current.condition.icon.replace("64x64", "128x128")}
          alt="Imagen de hoy"
          width="250px"
        ></img>
      </Box>
      <Box sx={style.currentTempContainer}>
        <Typography fontSize={120} color={"text.white"} variant="h4">
          {measurement === "F"
            ? `${weekData.current.temp_f}`
            : `${weekData.current.temp_c}`}
        </Typography>
        <Typography fontSize={60} color={"text.secondary"} variant="h4">
          °{measurement}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center", paddingTop: "50px" }}>
        <Typography fontSize={60} color={"text.white"} variant="h4">
          {weekData.current.condition.text}
        </Typography>
        <Typography padding={"20px"} color={"text.secondary"} variant="h6">
          Today · {formatCurrentDate(weekData.location.localtime)}
        </Typography>
        <Box sx={style.bottomContainer}>
          <Icon sx={{ width: "30px", height: "30px" }}>
            <LocationOnIcon sx={style.LocationOnIcon} />
          </Icon>
          <Typography color={"text.secondary"} variant="h6">
            {weekData.location.name}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={openSideBar ? asideStyle.showLeftAside : asideStyle.hideLeftAside}
      >
        <Box sx={{ textAlign: "right", padding: "20px" }}>
          <IconButton style={{ color: "white" }} onClick={handleSideBarClose}>
            <CloseIcon sx={asideStyle.closeIcon}></CloseIcon>
          </IconButton>
        </Box>
        <Box sx={asideStyle.searchContainer}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "80%",
            }}
          >
            <Autocomplete
              disablePortal
              id="searchBox"
              options={locationList}
              value={searchText}
              sx={asideStyle.searchBox}
              onInputChange={(event, value) => setSearchText(value)}
              isOptionEqualToValue={(option, value) => {
                return option.value === value.value;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search location"
                  sx={asideStyle.autocomplete}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon>
                          <SearchIcon />
                        </Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Box sx={asideStyle.historialContainer}>
              {historial.map((location) => (
                <TextField
                  onClick={() => handleButtonClick(location)}
                  key={uuidv4()}
                  fullWidth
                  disabled
                  defaultValue={location}
                  variant="filled"
                  margin="dense"
                  sx={asideStyle.historialTextField}
                />
              ))}
            </Box>
          </Box>
          <Button
            sx={{
              padding: "12px",
              backgroundColor: "button.main",
              color: "text.white",
              fontSize: "14px",
            }}
            disabled={disabledButton}
            onClick={() => handleButtonClick(searchText)}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const RightBox = ({ weekData }) => {
  return (
    <Box sx={style.rightBox}>
      <MeasurementButtons />
      <Box style={style.smallCardContainer}>
        <SmallCard
          date={weekData.forecast.forecastday[1].date}
          dayData={weekData.forecast.forecastday[1].day}
        ></SmallCard>
        <SmallCard
          date={weekData.forecast.forecastday[2].date}
          dayData={weekData.forecast.forecastday[2].day}
        ></SmallCard>
      </Box>
      <Box sx={{ paddingTop: 5, paddingBottom: 5 }}>
        <Typography variant="h4" sx={{ paddingLeft: "25px" }}>
          Today's Highlights
        </Typography>
      </Box>
      <Box style={style.largeCardContainer}>
        <LargeCard
          title={"Wind Status"}
          data={weekData.current.wind_kph}
          measurement={"kph"}
          bottomInfo={<Compass direction={weekData.current.wind_dir} />}
        ></LargeCard>
        <LargeCard
          title={"Humidity"}
          data={weekData.current.humidity}
          measurement={"%"}
          bottomInfo={
            <Box sx={{ width: "50%" }}>
              <LinearProgressWithLabel value={weekData.current.humidity} />
            </Box>
          }
        ></LargeCard>
        <LargeCard
          title={"Visibility"}
          data={weekData.current.vis_km}
          measurement={"km"}
        ></LargeCard>
        <LargeCard
          title={"Air Pressure"}
          data={weekData.current.pressure_mb}
          measurement={"mb"}
        ></LargeCard>
      </Box>
      <Box textAlign={"center"}>
        <Typography>Created by Lucas Oyarzun</Typography>
      </Box>
    </Box>
  );
};
const App = () => {
  const [measurement, setMeasurement] = useState("C");
  const [weekData, setWeekData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState("London");
  const getDataFromAPI = async (location) => {
    await axios
      .request({
        method: "GET",
        url: `https://api.weatherapi.com/v1/forecast.json`,
        params: {
          key: process.env.REACT_APP_API_KEY,
          q: location,
          aqi: "no",
          alerts: "no",
          days: "5",
        },
      })
      .then((response) => {
        setWeekData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    getDataFromAPI(location);
  }, [location]);

  return (
    <measurementContext.Provider value={{ measurement, setMeasurement }}>
      <ThemeProvider theme={theme}>
        {!isLoading ? (
          <Box sx={style.root}>
            <LeftBox
              weekData={weekData}
              measurement={measurement}
              setIsLoading={setIsLoading}
              setLocation={setLocation}
              getDataFromAPI={getDataFromAPI}
            />
            <RightBox weekData={weekData} />
          </Box>
        ) : (
          <Box sx={style.loadingScreen}>
            <CircularProgress color="primary" size="300px" />
          </Box>
        )}
      </ThemeProvider>
    </measurementContext.Provider>
  );
};
export default App;

const theme = createTheme({
  typography: {
    fontFamily: ["sans-serif", "Raleway"],
  },
  palette: {
    background: {
      main: "rgb(30, 33, 58)",
      dark: "rgb(16, 14, 29)",
    },
    text: {
      primary: "#173A5E",
      secondary: "#696787",
      white: "#FFFFFF",
    },
    button: {
      main: "rgb(110, 112, 122)",
    },
  },
});

const buttonStyle = {
  buttonOn: {
    backgroundColor: "text.white",
    borderRadius: "50%",
    padding: "15px",
    fontWeight: 600,
    color: "background.main",
    fontSize: 25,
  },
  buttonOff: {
    backgroundColor: "button.main",
    borderRadius: "50%",
    "&:hover": { color: "background.main" },
    padding: "15px",
    fontWeight: 600,
    color: "text.white",
    fontSize: 25,
  },
};

const asideStyle = {
  showLeftAside: {
    backgroundColor: "background.main",
    minWidth: "350px",
    width: {
      xs: "100%",
      sm: "100%",
      md: "100%",
      lg: "30%",
    },
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1,
    transition: "all 0.5s",
    height: "100%",
    overflowY: "hidden",
  },
  hideLeftAside: {
    width: {
      md: "100%",
      lg: "30%",
    },
    position: "fixed",
    top: 0,
    left: -1200,
    zIndex: 1,
    padding: "10px",
    transition: "all 0.5s",
  },
  closeIcon: {
    backgroundColor: "button.main",
    borderRadius: "50%",
    color: "white",
    padding: "5px",
    fontSize: 40,
    "&:hover": { backgroundColor: "background.main" },
  },
  searchContainer: {
    display: "flex",
    color: "text.white",
    alignItems: "start",
    padding: "15px",
  },
  searchBox: {
    backgroundColor: "background.main",
    marginRight: "30px",
    width: "80%",
    fontSize: "1.5rem",
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  },
  autocomplete: {
    input: {
      color: "white",
      fontSize: "20px",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  },
  historialContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  historialTextField: {
    backgroundColor: "background.main",
    marginRight: "20px",
    fontSize: "1.5rem",
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "white",
      textAlign: "center",
      fontSize: "1.3rem",
      color: "white",
    },
    width: "80%",
  },
};

const style = {
  loadingScreen: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "background.main",
  },
  root: {
    display: {
      md: "block",
      lg: "flex",
    },
    minHeight: "100vh",
    width: "100%",
  },
  leftBox: {
    backgroundColor: "background.main",
    minWidth: "350px",
    width: {
      md: "100%",
      lg: "30%",
    },
  },
  topContainer: {
    padding: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchButton: {
    backgroundColor: "button.main",
    color: "white",
    fontSize: 20,
    fontWeight: 500,
    padding: "10px",
  },
  gpsButton: {
    backgroundColor: "button.main",
    borderRadius: "50%",
    color: "white",
    padding: "5px",
    fontSize: 45,
    "&:hover": { backgroundColor: "background.main" },
  },
  currentTempContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    color: "text.secondary",
  },
  LocationOnIcon: {
    color: "text.white",
    width: "30px",
    height: "30px",
  },
  rightBox: {
    backgroundColor: "background.dark",
    flex: 1,
    color: "text.white",
    minWidth: "350px",
    width: {
      md: "100%",
      lg: "70%",
    },
    minHeight: "100vh",
  },
  temperatureContainer: {
    display: "flex",
    justifyContent: "right",
    alignItems: "end",
    padding: "25px",
  },
  smallCardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  largeCardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "left",
    flexWrap: "wrap",
  },
};

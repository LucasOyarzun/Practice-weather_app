import { Card, Typography, Box } from "@mui/material";
import measurementContext from "contexts/measurementContext";
import { useContext } from "react";

const TempBox = ({ min, max, measurement }) => {
  return (
    <Box sx={{ fontSize: 26 }}>
      <span style={{ color: "#696787", marginRight: 10 }}>
        {Math.trunc(min)}°{measurement}
      </span>
      <span>
        {Math.trunc(max)}°{measurement}
      </span>
    </Box>
  );
};

const weekday = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const today = (new Date().getDay() + 6) % 7;

// Small Card material UI component
export const SmallCard = ({ date, dayData }) => {
  const d = new Date(date).getDay();
  const title = d === (today + 1) % 7 ? "Tomorrow" : `${weekday[d]}`;

  const { measurement } = useContext(measurementContext);
  const min = measurement === "C" ? dayData.mintemp_c : dayData.mintemp_f;
  const max = measurement === "C" ? dayData.maxtemp_c : dayData.maxtemp_f;
  return (
    <Card sx={style.SmallCard}>
      <Typography variant="h5">{title}</Typography>
      <Box>
        <img
          src={dayData.condition.icon.replace("64x64", "128x128")}
          alt="Imagen del tiempo"
          width="150px"
        ></img>
      </Box>
      <Box>
        <TempBox min={min} measurement={measurement} max={max} />
      </Box>
    </Card>
  );
};

const style = {
  SmallCard: {
    backgroundColor: "background.main",
    color: "text.white",
    padding: "10px",
    maxWidth: "200px",
    textAlign: "center",
  },
};

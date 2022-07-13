import { Box, SvgIcon, Typography } from "@mui/material";
import NearMeTwoToneIcon from "@mui/icons-material/NearMeTwoTone";

const getRotation = (direction) => {
  switch (direction) {
    case "N":
      return "rotate(315deg)";
    case "NNE":
      return "rotate(337.5deg)";
    case "NE":
      return "rotate(0deg)";
    case "ENE":
      return "rotate(22.5deg)";
    case "E":
      return "rotate(45deg)";
    case "ESE":
      return "rotate(67.5deg)";
    case "SE":
      return "rotate(90deg)";
    case "SSE":
      return "rotate(112.5deg)";
    case "S":
      return "rotate(135deg)";
    case "SSW":
      return "rotate(157.5deg)";
    case "SW":
      return "rotate(180deg)";
    case "WSW":
      return "rotate(202.5deg)";
    case "W":
      return "rotate(225deg)";
    case "WNW":
      return "rotate(247.5deg)";
    case "NW":
      return "rotate(270deg)";
    case "NNW":
      return "rotate(292.5deg)";
    default:
      return "rotate(315deg)";
  }
};

// Componen with compass that shows the current direction
export const Compass = ({ direction }) => {
  const spin = getRotation(direction);
  return (
    <Box sx={style.compassContainer}>
      <SvgIcon sx={{ ...style.compassIcon, transform: spin }}>
        <NearMeTwoToneIcon />
      </SvgIcon>
      <Typography variant="h6">{direction}</Typography>
    </Box>
  );
};

const style = {
  compassContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  compassIcon: {
    width: "50px",
    height: "50px",
    color: "text.white",
    margin: "10px",
    display: "inline-block",
    verticalAlign: "middle",
  },
};

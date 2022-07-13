import { Card, Typography, Box } from "@mui/material";

// Large card material UI component
export const LargeCard = ({ title, data, measurement, bottomInfo = false }) => {
  return (
    <Card sx={style.LargeCard}>
      <Typography variant="h4">{title}</Typography>
      <Box sx={{ paddingTop: "20px", paddingBottom: "20px" }}>
        <Typography sx={style.centerText} variant="h2">
          {data}
        </Typography>
        <Typography sx={style.centerText} variant="h4">
          {measurement}
        </Typography>
      </Box>
      {bottomInfo ? <Box sx={style.bottomContainer}>{bottomInfo}</Box> : <></>}
    </Card>
  );
};

const style = {
  LargeCard: {
    backgroundColor: "background.main",
    color: "text.white",
    padding: "10px",
    minWidth: "300px",
    textAlign: "center",
    flexBasis: "45%",
    marginBottom: "20px",
    maxWidth: "550px",
  },
  centerText: {
    display: "inline",
    padding: "10px",
  },
  bottomContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
};

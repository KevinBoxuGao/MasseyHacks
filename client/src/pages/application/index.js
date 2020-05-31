import React, { useState, useEffect } from "react";
import { GoogleApiWrapper, Map, Polyline, HeatMap } from "google-maps-react";
import "./Application.scss";

import socketIOClient from "socket.io-client";
const ENDPOINT = "https://covmapsbackend--cristianbicheru.repl.co";
const apiKey = "";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  SvgIcon,
  Switch,
  Menu,
  MenuList,
  MenuItem,
  Popper,
  Grow,
  Paper,
} from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DestinationForm from "components/form/destination";
import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    width: "100%",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
    padding: "56px 16px 8px",
  },
  content: {
    flexGrow: 1,
  },
}));

function Application(props) {
  const classes = useStyles();
  const [startCoord, setStart] = useState();
  const [destinationCoord, setDestination] = useState();
  const [path, setPath] = useState([]);
  const [heatMapData, setHeatMapData] = useState([]);

  //map functions
  const parseData = (data) => {
    var ret = [];
    var pair;
    for (pair of data) {
      ret.push({
        location: new props.google.maps.LatLng(pair[0], pair[1]),
        weight: pair[2],
      });
    }
    return ret;
  };
  const handleSubmit = (start, destination) => {
    var coder = new props.google.maps.Geocoder();
    coder.geocode({ address: start }, function (data) {
      var data1 = data[0]["access_points"][0]["location"];
      coder.geocode({ address: destination }, function (data) {
        var data2 = data[0]["access_points"][0]["location"];
        var requestOptions = {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({
            latitude1: data1["latitude"],
            longitude1: data1["longitude"],
            latitude2: data2["latitude"],
            longitude2: data2["longitude"],
          }),
        };
        fetch(ENDPOINT + "/pathfind", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            setPath(
              props.google.maps.geometry.encoding.decodePath(data["path"])
            );
          })
          .catch((error) => {
            console.log("error", error);
          });
      });
    });
  };

  const [response, setResponse] = useState("");
  const fetchData = () => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("heatmap_update", (data) => {
      var ret = [];
      var pair;
      for (pair of data) {
        ret.push({
          lat: pair[0],
          lng: pair[1],
          weight: pair[2],
        });
      }
      console.log(heatMapData);
      //setHeatMapData(ret);
    });
  };

  //menu functions
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar variant="dense">
          <SvgIcon
            style={{ marginRight: "4px" }}
            height="100%"
            viewBox="0 0 435 393"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0)">
              <path
                d="M278.293 204.313L364.583 144.953M182.747 261.955L116.579 312.8M252.87 264.777L319.038 315.623M151.68 202.138L65.3893 142.778M136.909 163.125C101.339 177.486 42.694 177.999 5.5027 164.275M136.406 113.687C100.836 99.3264 42.1913 98.813 5 112.537M435.334 162.554C399.764 176.915 341.119 177.428 303.927 163.704M434.831 113.116C399.261 98.7554 340.616 98.242 303.424 111.966M150.358 332.829C124.718 342.738 82.4453 343.092 55.6369 333.623M149.995 298.718C124.356 288.809 82.0829 288.455 55.2745 297.924M374.863 330.087C349.223 339.996 306.95 340.35 280.142 330.88M374.5 295.975C348.861 286.066 306.588 285.712 279.779 295.181M149.136 201.104H212.771L243.187 263.655H179.552L149.136 201.104ZM282.38 201.104H218.744L188.329 263.655H251.964L282.38 201.104ZM103.236 137.781C103.236 143.394 88.7013 147.945 70.7713 147.945C52.8413 147.945 38.3062 143.394 38.3062 137.781C38.3062 132.168 52.8413 127.617 70.7713 127.617C88.7013 127.617 103.236 132.168 103.236 137.781ZM402.94 136.974C402.94 142.588 388.026 147.138 369.629 147.138C351.232 147.138 336.318 142.588 336.318 136.974C336.318 131.361 351.232 126.811 369.629 126.811C388.026 126.811 402.94 131.361 402.94 136.974ZM348.266 313.2C348.266 317.55 339.143 321.077 327.889 321.077C316.636 321.077 307.513 317.55 307.513 313.2C307.513 308.85 316.636 305.324 327.889 305.324C339.143 305.324 348.266 308.85 348.266 313.2ZM124.072 316.394C124.072 320.744 114.949 324.27 103.696 324.27C92.4422 324.27 83.3194 320.744 83.3194 316.394C83.3194 312.044 92.4422 308.517 103.696 308.517C114.949 308.517 124.072 312.044 124.072 316.394Z"
                stroke="#EEEEEE"
                strokeWidth="18.2052"
              />
              <path
                d="M218 250.312C217.882 250.201 217.735 250.06 217.56 249.892C217.048 249.403 216.298 248.68 215.342 247.742C213.431 245.868 210.701 243.14 207.423 239.728C200.868 232.903 192.129 223.342 183.391 212.399C174.652 201.454 165.922 189.136 159.379 176.795C152.832 164.446 148.5 152.121 148.5 141.15C148.5 108.8 179.494 82.5 218 82.5C256.506 82.5 287.5 108.8 287.5 141.15C287.5 152.121 283.168 164.446 276.621 176.795C270.078 189.136 261.348 201.454 252.609 212.399C243.871 223.342 235.132 232.903 228.577 239.728C225.299 243.14 222.569 245.868 220.658 247.742C219.702 248.68 218.952 249.403 218.44 249.892C218.265 250.06 218.118 250.201 218 250.312ZM192.5 141.15C192.5 153.163 204.006 162.775 218 162.775C231.994 162.775 243.5 153.163 243.5 141.15C243.5 129.137 231.994 119.525 218 119.525C204.006 119.525 192.5 129.137 192.5 141.15Z"
                fill="white"
                stroke="#EEEEEE"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="435" height="393" fill="white" />
              </clipPath>
            </defs>
          </SvgIcon>
          <Typography variant="h6">CovidMaps</Typography>
          <IconButton
            style={{ marginLeft: "auto" }}
            color="inherit"
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <MoreVertIcon />
          </IconButton>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="menu-list-grow"
                      onKeyDown={handleListKeyDown}
                    >
                      <MenuItem>
                        <Typography variant="body1">Dark Mode</Typography>
                        <Switch
                          checked={props.darkMode}
                          onChange={() => props.toggleTheme(!props.darkMode)}
                        />
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="persistent"
        open={true}
      >
        <div className={classes.drawerContainer}>
          <Typography variant="h6">Create Route</Typography>
          <DestinationForm submitFunction={handleSubmit} />
        </div>
      </Drawer>
      <main
        style={{ height: "100%", width: "100%" }}
        className={classes.content}
      >
        <div
          style={{
            paddingTop: "48px",
            height: "100%",
            width: "100%",
            position: "relative",
          }}
        >
          <Map
            google={props.google}
            center={props.center}
            zoom={props.zoom}
            position="relative"
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
            onReady={() => fetchData}
          >
            <Polyline
              path={path}
              strokeColor="#0000FF"
              strokeOpacity={0.8}
              strokeWeight={2}
            />
            {<HeatMap positions={[]} opacity={1} radius={20} />}
          </Map>
        </div>
      </main>
    </div>
  );
}
Application.defaultProps = {
  center: {
    lat: 59.95,
    lng: 30.33,
  },
  zoom: 11,
};

export default GoogleApiWrapper({
  apiKey: apiKey,
})(Application);

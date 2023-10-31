import { FixedSizeGrid } from "react-window";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CardActionArea,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React, { CSSProperties } from "react";
import get_pkg_name from "../utils/pkg-name";

interface Package {
  name?: string
  project: string
  birthtime: string
  description?: string
}

export default function PackageGrid({ pkgs }: {pkgs: Package[]}) {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  if (!pkgs?.length) {
    return
  }

  //TODO on mobile the bottom of the card should size to fit but OBV MUI + CSS make that tricky
  const text_style: CSSProperties = {whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}
  const columnCount = isxs ? 2 : 3
  const columnWidth = isxs ? (window.innerWidth - 28) / 2 : 300

  const Item = ({ columnIndex, rowIndex, style }: { columnIndex: number, rowIndex: number, style: React.CSSProperties }) => {
    const {project, name, description} = pkgs[rowIndex * 3 + columnIndex] ?? {}
    if (!project) return
    return <Box style={style} pb={1.5}>
      <Card sx={{m: 0.75, height: '100%'}}>
        <CardActionArea href={`/pkgs/${project}/`}>
          <CardMedia
            height={columnWidth}
            component='img'
            image={`https://gui.tea.xyz/prod/${project}/512x512.webp`}
          />
          <CardContent>
            <Typography variant='overline' component="h2" style={text_style}>
              {name || get_pkg_name(project)}
            </Typography>
            <Typography variant='caption' component="h3" style={text_style}>
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  }

  return (
    <FixedSizeGrid
      columnCount={columnCount}
      rowCount={Math.ceil(pkgs.length / columnCount)}
      columnWidth={columnWidth}
      rowHeight={columnWidth + (isxs ? 95 : 95)}
      width={columnWidth * columnCount}
      height={window.innerHeight}
    >
      {Item}
    </FixedSizeGrid>
  );
}

const cardMediaStyle = {
  height: 0,
  paddingTop: "56.25%" // 16:9
}
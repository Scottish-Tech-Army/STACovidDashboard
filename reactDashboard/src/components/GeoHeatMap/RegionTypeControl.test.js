/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValues"] }] */

import React from "react";
import { RegionTypeControl } from "./RegionTypeControl";
import {
  AREATYPE_COUNCIL_AREAS,
  AREATYPE_HEALTH_BOARDS,
} from "../HeatmapDataSelector/HeatmapConsts";
import { MapContainer } from "react-leaflet";
import { renderWithUser } from "../../ReactTestUtils";

const setAreaType = jest.fn();

test("default render", async () => {
  const { user } = renderWithUser(
    <MapContainer>
      <RegionTypeControl
        areaType={AREATYPE_HEALTH_BOARDS}
        setAreaType={setAreaType}
      />
    </MapContainer>
  );

  expect(healthBoardsButton().textContent).toBe("Health Boards");
  expect(councilAreasButton().textContent).toBe("Council Areas");

  await user.click(councilAreasButton());
  expect(setAreaType).toHaveBeenLastCalledWith(AREATYPE_COUNCIL_AREAS);

  await user.click(healthBoardsButton());
  expect(setAreaType).toHaveBeenLastCalledWith(AREATYPE_HEALTH_BOARDS);
});

const healthBoardsButton = () =>
  document.querySelector("#healthBoards + label");
const councilAreasButton = () =>
  document.querySelector("#councilAreas + label");

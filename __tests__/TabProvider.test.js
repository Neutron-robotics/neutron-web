import React, { useEffect, useState } from "react";
import { render } from "@testing-library/react";
import { useTabs, useTabsDispatch } from "../src/contexts/TabContext";
import "@testing-library/jest-dom";

describe("Tab Provider", () => {
  const makeMockComponent = () => {
    return () => {
      const tabs = useTabs();
      const dispatch = useTabsDispatch();

      const createTab = () => {
        dispatch()
      };

      const removeTab = () => {};

      const createComponent = () => {};

      const commitComponent = () => {};

      const removeComponent = () => {};

      return (
        <>
          {Object.entries(tabs).map(
            ([key, value]) =>
              `${key} ${
                (Object.entries(value.components).reduce(
                  (acc, [curKey, curVal]) =>
                    `${acc} ${curKey} ${curVal.builder.id}`
                ),
                [""])
              }`
          )}

          <button onClick={createTab}>create tab</button>
          <button onClick={removeTab}>remove tab</button>
          <button onClick={createComponent}>create component</button>
          <button onClick={commitComponent}>commit component</button>
          <button onClick={removeComponent}>remove component</button>
        </>
      );
    };
  };

  test.todo("create tab successfully");

  test.todo("create tab errors due to duplicate");

  test.todo("remove tab");

  test.todo("remove unexisting tab");

  test.todo("create component successfully");

  test.todo("create component errors due to duplicate");

  test.todo("remove component successfully");

  test.todo("remove unexisting component");

  test.todo("remove component from unexisting tab");

  test.todo("commit component specifics successfully");

  test.todo("commit component specifics from unexisting tab");

  test.todo("commit component specifics from unexisting component");
});

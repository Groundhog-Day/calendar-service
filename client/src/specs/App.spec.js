import React from "react";
import { shallow } from "enzyme";
import App from "../components/App.js";
import "isomorphic-fetch";

describe("App", () => {
  test("App component should mount", () => {
    const wrap = shallow(<App />);
    expect(wrap).toMatchSnapshot();
  });
});

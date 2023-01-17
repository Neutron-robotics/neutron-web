import { Button } from "@mui/material";
import { render, screen, fireEvent } from "@testing-library/react";
import { AlertProvider, useAlert } from "../src/contexts/AlertContext";
import "@testing-library/jest-dom";

describe("Alert Provider", () => {
  const makeMockComponent = () => {
    const Component = () => {
      const alert = useAlert();

      const handleErrorClick = () => {
        alert.error("This is an error");
      };

      const handleWarnClick = () => {
        alert.warn("This is a warning");
      };

      const handleInfoClick = () => {
        alert.info("This is an info");
      };

      const handleSuccessClick = () => {
        alert.success("This is a success");
      };
      return (
        <div>
          <Button onClick={handleErrorClick}>ERROR</Button>
          <Button onClick={handleWarnClick}>WARN</Button>
          <Button onClick={handleInfoClick}>INFO</Button>
          <Button onClick={handleSuccessClick}>SUCCESS</Button>
        </div>
      );
    };
    return Component;
  };

  test("initialize successfully", () => {
    render(
      <AlertProvider>
        <div></div>
      </AlertProvider>
    );
  });

  test("trigger alerts", async () => {
    const Component = makeMockComponent();
    render(
      <AlertProvider>
        <Component />
      </AlertProvider>
    );

    const errorBtn = screen.getByText("ERROR");
    const warnBtn = screen.getByText("WARN");
    const infoBtn = screen.getByText("INFO");
    const successBtn = screen.getByText("SUCCESS");

    fireEvent.click(errorBtn);
    const errorAlert = await screen.findByText("This is an error");
    expect(errorAlert).toBeInTheDocument();
    fireEvent.click(screen.getByTitle("Close"));
    expect(screen.queryByText("This is an error")).not.toBeInTheDocument();

    fireEvent.click(warnBtn);
    const warnAlert = await screen.findByText("This is a warning");
    expect(warnAlert).toBeInTheDocument();
    fireEvent.click(screen.getByTitle("Close"));
    expect(screen.queryByText("This is a warning")).not.toBeInTheDocument();

    fireEvent.click(infoBtn);
    const infoAlert = await screen.findByText("This is an info");
    expect(infoAlert).toBeInTheDocument();
    fireEvent.click(screen.getByTitle("Close"));
    expect(screen.queryByText("This is an info")).not.toBeInTheDocument();

    fireEvent.click(successBtn);
    const successAlert = await screen.findByText("This is a success");
    expect(successAlert).toBeInTheDocument();
    fireEvent.click(screen.getByTitle("Close"));
    expect(screen.queryByText("This is a success")).not.toBeInTheDocument();
  });

  test("trigger multiple same alerts", async () => {
    const Component = makeMockComponent();
    render(
      <AlertProvider>
        <Component />
      </AlertProvider>
    );

    const errorBtn = screen.getByText("ERROR");
    fireEvent.click(errorBtn);
    fireEvent.click(errorBtn);
    const errorsAlert = await screen.findAllByText("This is an error");
    expect(errorsAlert).toHaveLength(2);
  });

  test("trigger multiple different alerts", async () => {
    const Component = makeMockComponent();
    render(
      <AlertProvider>
        <Component />
      </AlertProvider>
    );

    const errorBtn = screen.getByText("ERROR");
    const warnBtn = screen.getByText("WARN");
    const infoBtn = screen.getByText("INFO");
    const successBtn = screen.getByText("SUCCESS");

    fireEvent.click(errorBtn);
    fireEvent.click(warnBtn);
    fireEvent.click(infoBtn);
    fireEvent.click(successBtn);
    const errorsAlert = await screen.findByText("This is an error");
    const infoAlert = await screen.findByText("This is an error");
    const warnAlert = await screen.findByText("This is an error");
    const successAlert = await screen.findByText("This is an error");
    expect(errorsAlert).toBeInTheDocument();
    expect(infoAlert).toBeInTheDocument();
    expect(warnAlert).toBeInTheDocument();
    expect(successAlert).toBeInTheDocument();
  });
});

import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToastStore } from "../../store/toastStore";
import { useToast } from "../useToast";

describe("useToast", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it("adds a toast to the store when showToast is called", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("Hello world");
    });

    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe("Hello world");
  });

  it("adds multiple toasts independently", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("First");
      result.current.showToast("Second");
    });

    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(2);
  });
});

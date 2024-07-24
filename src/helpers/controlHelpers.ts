export type RenderCallback = (pageNum: number, zoomLevel?: number) => void;

class ControlHelper {
  constructor(cb?: RenderCallback) {
    this.RenderPage = cb;
    this.TotalPages = 1;
    this.DefaultScaleValue = 1;
    this.CurrentPageNumber = 1;
    this.CurrentScaleValue = 1;
    this.IsPageRendering = false;
  }

  private RenderPage: RenderCallback | undefined;
  TotalPages: number;
  CurrentPageNumber: number;
  private DefaultScaleValue: number;
  CurrentScaleValue: number;
  IsPageRendering: boolean;

  public RenderNextPage() {
    if (this.IsPageRendering) return;

    if (this.CurrentPageNumber < this.TotalPages) {
      const newValue = this.CurrentPageNumber + 1;
      this.RenderPage?.(newValue, this.CurrentScaleValue);
      this.CurrentPageNumber = newValue;
    }
  }

  public RenderPreviousPage() {
    if (this.IsPageRendering) return;

    if (this.CurrentPageNumber > 1) {
      const newValue = this.CurrentPageNumber - 1;
      this.RenderPage?.(newValue, this.CurrentScaleValue);
      this.CurrentPageNumber = newValue;
    }
  }

  public ZoomIn() {
    if (this.IsPageRendering) return;

    if (this.CurrentScaleValue <= 5) {
      const newValue = this.CurrentScaleValue + 0.5;
      this.RenderPage?.(this.CurrentPageNumber, newValue);
      this.CurrentScaleValue = newValue;
    }
  }

  public ZoomOut() {
    if (this.IsPageRendering) return;

    if (this.CurrentScaleValue > 0.5) {
      const newValue = this.CurrentScaleValue - 0.5;
      this.RenderPage?.(this.CurrentPageNumber, newValue);
      this.CurrentScaleValue = newValue;
    }
  }

  public JumpToPage(pageNumber: number) {
    if (this.IsPageRendering) return;

    if (pageNumber >= 1 && pageNumber <= this.TotalPages) {
      this.RenderPage?.(pageNumber, this.CurrentScaleValue);
      this.CurrentPageNumber = pageNumber;
    }
  }
}

export default ControlHelper;

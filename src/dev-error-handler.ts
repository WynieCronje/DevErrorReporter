export class DevErrorHandler {
  private errors: string[] = [];

  private config: DevErrorHandlerConfig;
  private defaultConfig: DevErrorHandlerConfig = {
    appendToElement: 'body',
  };

  constructor(config?: DevErrorHandlerConfig) {
    this.config = {
      ...this.defaultConfig,
      ...config,
    };
  }

  showError(error: any) {
    if (!error.stack) {
      return;
    }
    if (this.errors.some((x) => x === error.stack)) {
      return;
    }
    if (document.getElementsByTagName(this.config.appendToElement).length === 0) {
      throw Error(`Could not find element with name '${this.config.appendToElement}'`);
    }

    this.errors.push(error.stack);
    const $errorMsg = document.createElement('div');

    $errorMsg.className += 'msg-backdrop';

    $errorMsg.style.overflowY = 'auto';
    $errorMsg.style.maxHeight = '90vh';
    $errorMsg.style.maxWidth = '100%';
    $errorMsg.style.overflowX = 'auto';
    $errorMsg.style.position = 'fixed';
    $errorMsg.style.left = '0';
    $errorMsg.style.bottom = '0';
    $errorMsg.style.fontSize = '11px';
    $errorMsg.style.fontFamily = 'calibri';
    $errorMsg.style.padding = '10px';
    $errorMsg.style.zIndex = `10000${this.errors.length + 1}`;
    $errorMsg.style.color = 'white';
    $errorMsg.style.boxSizing = 'border-box';
    $errorMsg.style.backgroundColor = 'rgba(0,0,0,0.8)';
    $errorMsg.innerHTML = ` <p style="
                    font-size: 16px;
                    font-weight: bold;
                    color:#ff6c37;">PLEASE CHECK YOUR CONSOLE!!!!</p>
                    <pre style="color:white; max-width:100%; overflow-y:auto">${error.stack}</pre>`;

    const $errorClose = document.createElement('a');
    $errorClose.href = 'javascript:void(0)';
    $errorClose.style.textDecoration = 'none';
    $errorClose.style.position = 'absolute';
    $errorClose.style.right = '0';
    $errorClose.style.top = '0';
    $errorClose.style.fontSize = '16px';
    $errorClose.style.fontFamily = 'calibri';
    $errorClose.style.padding = '8px';
    $errorClose.style.color = 'white';
    $errorClose.style.backgroundColor = '#ff6c37';
    $errorClose.innerHTML = '&times;';

    if (this.errors.length > 1) {
      const widths: number[] = [];
      const msgBackDrops = document.getElementsByClassName('msg-backdrop') as HTMLCollectionOf<HTMLDivElement>;
      const msgBackDropsLength = msgBackDrops.length;

      for (let i = 0; i < msgBackDropsLength; i++) {
        widths.push(msgBackDrops.item(i).clientWidth);
      }

      const maxWidth = widths.reduce((a, b) => Math.max(a, b));
      for (let i = 0; i < msgBackDropsLength; i++) {
        msgBackDrops.item(i).style.width = `${maxWidth}px`;
      }
    }

    $errorClose.addEventListener('click', () => {
      $errorMsg.remove();
      this.errors = this.errors.filter((x) => x !== error.stack);
    });

    $errorMsg.append($errorClose);
    document.getElementsByTagName(this.config.appendToElement)[0].append($errorMsg);
  }
}
export interface DevErrorHandlerConfig {
  /**
   * Element where error popups should be appended to (Usually root app element)
   * Defaults to `body`
   */
  appendToElement: string;
}

declare namespace chrome {
  namespace tabs {
    interface Tab {
      id?: number;
      title?: string;
      url?: string;
    }

    function query(queryInfo: { active?: boolean; currentWindow?: boolean }): Promise<Tab[]>;
  }

  namespace scripting {
    interface InjectionTarget {
      tabId: number;
    }

    interface InjectionResult<T> {
      result?: T;
    }

    function executeScript<Args extends unknown[], Result>(details: {
      target: InjectionTarget;
      func: (...args: Args) => Result;
      args: Args;
    }): Promise<Array<InjectionResult<Result>>>;
  }

  namespace runtime {
    interface MessageSender {
      tab?: tabs.Tab;
    }

    const onInstalled: {
      addListener(callback: () => void): void;
    };

    const onMessage: {
      addListener(
        callback: (
          message: unknown,
          sender: MessageSender,
          sendResponse: (response?: unknown) => void
        ) => boolean | void
      ): void;
    };

    function sendMessage(message: unknown): void;
  }

  namespace sidePanel {
    function setPanelBehavior(options: { openPanelOnActionClick: boolean }): Promise<void>;
  }
}

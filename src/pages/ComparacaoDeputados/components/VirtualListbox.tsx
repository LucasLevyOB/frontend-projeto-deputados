import React, { createContext, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { Box } from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualListboxContextValue {
  onLoadMore?: () => void;
}

export const VirtualListboxContext = createContext<VirtualListboxContextValue>({});

export const VirtualListbox = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  function VirtualListbox(props, ref) {
    const { children, ...otherProps } = props;
    const { onLoadMore } = useContext(VirtualListboxContext);
    const localRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

    const items = React.Children.toArray(children) as React.ReactElement[];
    const isItemList = items.length > 0 && React.isValidElement(items[0]);

    const rowVirtualizer = useVirtualizer({
      count: isItemList ? items.length : 0,
      getScrollElement: () => localRef.current,
      estimateSize: () => 52,
      overscan: 5,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();

    useEffect(() => {
      if (!isItemList || !onLoadMore || virtualItems.length === 0) return;

      const lastVirtualItem = virtualItems[virtualItems.length - 1];
      if (lastVirtualItem && lastVirtualItem.index >= items.length - 3) {
        onLoadMore();
      }
    }, [virtualItems, items.length, isItemList, onLoadMore]);

    if (!isItemList) {
      return (
        <Box
          ref={localRef}
          component="div"
          role="listbox"
          {...otherProps}
          sx={{
            maxHeight: 280,
            overflowY: 'auto',
            p: 1,
          }}
        >
          {children}
        </Box>
      );
    }

    return (
      <Box
        ref={localRef}
        component="div"
        role="listbox"
        {...otherProps}
        sx={{
          maxHeight: 280,
          overflowY: 'auto',
          position: 'relative',
          p: 0,
          m: 0,
        }}
      >
        <Box
          sx={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualRow) => {
            const child = items[virtualRow.index];
            return (
              <Box
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {child}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }
);

VirtualListbox.displayName = 'VirtualListbox';

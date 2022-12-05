// @flow
import React, { useCallback, useState, useRef, memo, useEffect } from "react";
import debounce from "lodash/debounce";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";

const ScrollContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({
  vertical: true,
  pl: p.theme.overflow.trackSize,
  mb: -40,
}))`
  ${p => p.theme.overflow.yAuto};
`;

type ScrollLoadingListProps = {
  data: Array<*>,
  renderItem: (*, index: number) => React$Node,
  noResultPlaceholder: ?React$Node,
  scrollEndThreshold?: number,
  bufferSize?: number,
  style?: *,
  fetchPoolsFromNextPage: () => Promise<void>,
  search: string,
};

const ScrollLoadingList = ({
  data,
  renderItem,
  noResultPlaceholder,
  scrollEndThreshold = 200,
  bufferSize = 20,
  style,
  fetchPoolsFromNextPage,
  search,
}: ScrollLoadingListProps) => {
  const scrollRef = useRef();
  const [scrollOffset, setScrollOffset] = useState(bufferSize);

  useEffect(() => {
    // $FlowFixMe
    if (search !== "") {
      setScrollOffset(bufferSize);
    } else {
      setScrollOffset(data.length - 20);
    }
  }, [data, scrollRef, bufferSize]);

  const handleScroll = useCallback(async () => {
    const target = scrollRef && scrollRef.current;
    if (
      target &&
      // $FlowFixMe
      target.scrollTop + target.offsetHeight >= target.scrollHeight - scrollEndThreshold
    ) {
      fetchPoolsFromNextPage();
      setScrollOffset(Math.min(data.length, scrollOffset + bufferSize));
    }
  }, [
    setScrollOffset,
    fetchPoolsFromNextPage,
    scrollOffset,
    data.length,
    bufferSize,
    scrollEndThreshold,
  ]);

  return (
    <ScrollContainer ref={scrollRef} onScroll={debounce(handleScroll, 50)} style={style}>
      {data.slice(0, scrollOffset).map(renderItem)}
      {data.length <= 0 && noResultPlaceholder}
    </ScrollContainer>
  );
};

export default memo<ScrollLoadingListProps>(ScrollLoadingList);

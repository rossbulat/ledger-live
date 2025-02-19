import React, { useReducer, useEffect } from "react";
import { map } from "rxjs/operators";
import styled, { keyframes } from "styled-components";
import { trackSubject } from "~/renderer/analytics/segment";

const Root = styled.div`
  position: fixed;
  z-index: 9999999999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;
const Container = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  text-align: right;
`;
const fadeaway = keyframes`
  from {
    opacity: 1;
  }

  50% {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;
const Row = styled.div`
  font-size: 10px;
  display: flex;
  flex-direction: row;
  padding: 5px;
  background-color: #ffffffcc;
  animation-name: ${fadeaway};
  animation-duration: 8s;
  animation-iteration-count: 1;
  opacity: 0;
`;
const Event = styled.div`
  font-size: 10px;
  font-weight: bold;
`;
const Property = styled.div`
  font-size: 8px;
  flex: 1;
  margin-right: 10px;
`;
let id = 0;

type Item = {
  event: string;
  properties: Object | null | undefined;
  id: number;
};

function AnalyticsConsole() {
  const [items, addItem] = useReducer(
    (items: Item[], item: Item) => (items.length > 10 ? items.slice(1) : items).concat(item),
    [],
  );
  useEffect(() => {
    trackSubject
      .pipe(
        map(item => ({
          ...item,
          id: ++id,
        })),
      )
      .subscribe(addItem);
  }, []);
  return (
    <Root>
      <Container>
        {items.map(item => (
          <Row key={item.id}>
            <Property>{item.properties ? JSON.stringify(item.properties) : null}</Property>
            <Event>{item.event}</Event>
          </Row>
        ))}
      </Container>
    </Root>
  );
}
export default AnalyticsConsole;

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSkeletonVisibility } from "~/renderer/actions/application";
import { alwaysShowSkeletonsSelector } from "~/renderer/reducers/application";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
const Item = styled.div`
  padding: 2px 13px;
  background: ${p => p.theme.colors.alertRed};
  opacity: 0.9;
  height: 100%;
  min-height: 22px;
`;
const DebugSkeletons = () => {
  const dispatch = useDispatch();
  const alwaysShowSkeletons = useSelector(alwaysShowSkeletonsSelector);
  const handleToggleSkeletons = useCallback(() => {
    dispatch(toggleSkeletonVisibility(!alwaysShowSkeletons));
  }, [alwaysShowSkeletons, dispatch]);
  return (
    <Box p={0} horizontal>
      <Item onClick={handleToggleSkeletons}>
        {alwaysShowSkeletons ? "Hide skeletons" : "Show skeletons"}
      </Item>
    </Box>
  );
};
export default DebugSkeletons;

import styled from "styled-components";

export const Wrapper = styled.div`
  .autocomplete-suggestion {
    position: absolute;
    border: 1px solid #d4d4d4;
    border-bottom: none;
    border-top: none;
    z-index: 99;
    left: 0;
    right: 0;

    .autocomplete-suggestion-item {
      padding: 10px;
      cursor: pointer;
      background-color: #fff;
      border-bottom: 1px solid #d4d4d4;
    }
  }
`;

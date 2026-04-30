import styled from "styled-components";

export const IconActionButton = styled.button<{ $active?: boolean }>`
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 4px;
    transition: background-color 0.2s ease;
    appearance: none;

    background: ${({ $active = false }) => ($active ? "#4f83e3" : "#e9edf5")};
    color: ${({ $active = false }) => ($active ? "#fff" : "#4f83e3")};

    &:hover {
        background: ${({ $active = false }) => ($active ? "#3f74d6" : "#dce4f3")};
    }

    svg {
        width: 14px;
        height: 14px;
    }
`;

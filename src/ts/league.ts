enum League {
    FIRST,
    SECOND,
}

export const isFirstPlayer = (league: League) => league === League.FIRST;

export default League;

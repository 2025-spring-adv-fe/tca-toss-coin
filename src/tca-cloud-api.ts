import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { GameResult } from "./GameResults";

export const saveGameToCloud = async (
  email: string,
  appName: string,
  timestamp: string,
  game: GameResult
) => {
  const userKey = email.trim().toLowerCase();
  if (!userKey) return;

  const item = {
    pk: userKey,
    sk: `${appName}#${timestamp}`,
    app: appName,
    user: email,
    timestamp,
    game: {
      ...game,
      tosses: game.tosses,
      headsCount: game.headsCount,
      tailsCount: game.tailsCount
    }
  };

  await fetch("https://32wop75hhc.execute-api.us-east-1.amazonaws.com/prod/data", {
    method: 'POST',
    body: JSON.stringify({
      TableName: "tca-data",
      Item: marshall(item, { removeUndefinedValues: true })
    })
  });
};

export const loadGamesFromCloud = async (email: string, appName: string) => {
  const userKey = email.trim().toLowerCase();
  if (!userKey) return [];

  try {
    const response = await fetch(
      `https://32wop75hhc.execute-api.us-east-1.amazonaws.com/prod/data/?user=${userKey}&game=${appName}`
    );
    const data = await response.json();
    return data.Items?.map((item: any) => unmarshall(item).game as GameResult) || [];
  } catch (error) {
    console.error("Cloud load failed:", error);
    return [];
  }
};
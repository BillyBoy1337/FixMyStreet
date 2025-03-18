package database

// func queryDbResponse(queryPager *runtime.Pager[azcosmos.QueryItemsResponse], result interface{}) error {
// 	for queryPager.More() {
// 		queryResponse, err := queryPager.NextPage(context.TODO())
// 		if err != nil {
// 			return fmt.Errorf("failed to query items: %w", err)
// 		}

// 		for _, item := range queryResponse.Items {
// 			// fmt.Print("Item", item)
// 			err = json.Unmarshal(item, result)
// 			fmt.Print("Result", result)
// 			if err != nil {
// 				return fmt.Errorf("failed to unmarshal item: %w", err)
// 			}
// 		}
// 	}
// 	return nil
// }

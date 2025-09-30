-- Dữ liệu bảng analytics_events
-- Xuất lúc: 2025-09-29T03:46:03.441Z
-- Số bản ghi: 10

INSERT INTO analytics_events (id, event_type, user_id, content_id, timestamp, meta) VALUES
  ('1d04bb17-27cf-4eec-a95a-d2dd9a0a0dfb', 'share', 'b1cf21ea-a179-4aa4-a4cc-b5bbfe699ced', NULL, '2024-06-01T10:45:00.000Z', '{"info":"Shared"}'::jsonb),
  ('2fbbcb92-c3de-4c0e-a93c-aea3cd936e8d', 'comment', 'c017870a-8d7d-4a57-972b-8cfe35d75761', NULL, '2024-06-01T10:35:00.000Z', '{"info":"Commented"}'::jsonb),
  ('374b5cc2-0480-4b6a-ba10-41f1bedec44f', 'bookmark', NULL, '17c93822-d2a9-44cc-93b4-8e82869f7c07', '2024-06-01T10:15:00.000Z', '{"info":"Bookmarked"}'::jsonb),
  ('4406f0ed-fb9e-4433-bec1-77581694bfba', 'bookmark', 'f468dfe3-f47e-4478-bfc9-78dfa44d8252', '12e9b9dd-41cc-4135-8836-6f0791dc7e43', '2024-06-01T10:40:00.000Z', '{"info":"Bookmarked"}'::jsonb),
  ('6ce2ecf5-53f7-4279-9547-2a54ea09b018', 'page_view', 'f2f22599-3609-4b4d-90eb-ed67bc9e61c7', NULL, '2024-06-01T10:00:00.000Z', '{"info":"Viewed homepage"}'::jsonb),
  ('77c8be66-d5b3-4331-83ef-7610a00566be', 'like', NULL, NULL, '2024-06-01T10:05:00.000Z', '{"info":"Liked content"}'::jsonb),
  ('78c5cb00-82d7-47e0-9b27-e907263c7f3e', 'like', 'e7bb5aab-1217-4e4c-8256-365f25e2d94b', '4000a698-b759-4dcf-8f81-9d57f904490b', '2024-06-01T10:30:00.000Z', '{"info":"Liked content"}'::jsonb),
  ('81668ccc-8b04-40ad-bb3c-09de8243e3a4', 'comment', 'd55abd56-bff8-438d-86c7-05fd5dafd793', 'dbecccdb-db13-4a48-9bbc-52b22907d95a', '2024-06-01T10:10:00.000Z', '{"info":"Commented"}'::jsonb),
  ('ab3f2db0-1e3f-4681-b79f-0756c41887c3', 'share', 'd87744bd-4db1-463d-b934-1e7618ecbf54', NULL, '2024-06-01T10:20:00.000Z', '{"info":"Shared"}'::jsonb),
  ('f8f55159-f84c-4c4a-84c2-c2e3dbdd6240', 'page_view', '753516d9-47b0-4fa2-87be-20ea4558fb01', NULL, '2024-06-01T10:25:00.000Z', '{"info":"Viewed content"}'::jsonb);

